using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using TradeNest.AiService.DTOs;

namespace TradeNest.AiService.Services
{
    public interface IAiService
    {
        Task<List<RecommendationItem>> GetRecommendationsAsync(string query);
    }

    public class AiServiceImpl : IAiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly string _geminiApiKey;
        private readonly string _geminiApiUrl;
        private readonly string _productServiceUrl;

        public AiServiceImpl(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
            _geminiApiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? _config["Gemini:ApiKey"] ?? string.Empty;
            _geminiApiUrl = _config["Gemini:ApiUrl"] ?? "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
            _productServiceUrl = _config["ProductServiceUrl"] ?? "http://localhost:5102/api/products";
        }

        public async Task<List<RecommendationItem>> GetRecommendationsAsync(string query)
        {
            var allProducts = await _httpClient.GetFromJsonAsync<List<ProductDto>>(_productServiceUrl);
            if (allProducts == null || !allProducts.Any()) return new List<RecommendationItem>();

            var filteredProducts = PreFilterProducts(query, allProducts);
            if (!filteredProducts.Any()) filteredProducts = allProducts;

            var prompt = BuildPrompt(query, filteredProducts);
            var jsonResponse = await CallGeminiApiAsync(prompt);

            return ParseGeminiResponse(jsonResponse, filteredProducts);
        }

        private List<ProductDto> PreFilterProducts(string query, List<ProductDto> products)
        {
            var lowerQuery = query.ToLower();
            decimal? maxBudget = null;

            var match = Regex.Match(lowerQuery, @"(?:under|below|<|max)\s*(?:rs\.?|\u20B9)?\s*(\d+(?:,\d+)*)");
            if (match.Success)
            {
                if (decimal.TryParse(match.Groups[1].Value.Replace(",", ""), out var budget))
                {
                    maxBudget = budget;
                }
            }

            return products.Where(p => 
            {
                if (!string.Equals(p.Status, "AVAILABLE", StringComparison.OrdinalIgnoreCase)) return false;
                if (maxBudget.HasValue && p.Price > maxBudget.Value) return false;
                return true;
            }).ToList();
        }

        private string BuildPrompt(string query, List<ProductDto> products)
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("You are an AI Shopping Assistant for TradeNest. Based on the user's query, recommend the best products from the provided catalog.");
            sb.AppendLine("Rules:");
            sb.AppendLine("1. ONLY recommend products that exist in the provided JSON catalog.");
            sb.AppendLine("2. DO NOT invent or hallucinate products, prices, or details.");
            sb.AppendLine("3. Output STRICTLY valid JSON. Do not include markdown code blocks like `json or any conversational text.");
            sb.AppendLine("4. Calculate a match 'score' (0-100) based on how well the product fits the user query.");
            sb.AppendLine("5. Provide a short 'reason' for why this product is recommended.");
            sb.AppendLine("6. Return up to 6 best matching products.");
            sb.AppendLine("7. The output MUST match this exact schema: { \"recommendations\": [ { \"productId\": 1, \"score\": 95, \"reason\": \"Matches your budget\" } ] }");
            
            sb.AppendLine($"\nUser Query: \"{query}\"\n");
            sb.AppendLine("Product Catalog:\n[");
            
            for (int i = 0; i < products.Count; i++)
            {
                var p = products[i];
                var name = p.Pname?.Replace("\"", "\\\"").Replace("\n", " ");
                var cat = p.CategoryName?.Replace("\"", "\\\"").Replace("\n", " ");
                var desc = p.Pdesc?.Replace("\"", "\\\"").Replace("\n", " ");
                sb.Append($"  {{\"id\":{p.Pid},\"name\":\"{name}\",\"category\":\"{cat}\",\"price\":{p.Price},\"desc\":\"{desc}\"}}");
                if (i < products.Count - 1) sb.Append(",");
                sb.AppendLine();
            }
            sb.AppendLine("]");
            return sb.ToString();
        }

        private async Task<string> CallGeminiApiAsync(string prompt)
        {
            if (string.IsNullOrWhiteSpace(_geminiApiKey))
            {
                throw new InvalidOperationException("Gemini API key is not configured. Set the GEMINI_API_KEY environment variable or Gemini:ApiKey in configuration.");
            }

            var url = _geminiApiUrl + _geminiApiKey;
            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };
            
            var response = await _httpClient.PostAsJsonAsync(url, requestBody);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Gemini API request failed with status {(int)response.StatusCode} ({response.ReasonPhrase}): {errorContent}");
            }
            return await response.Content.ReadAsStringAsync();
        }

        private List<RecommendationItem> ParseGeminiResponse(string responseBody, List<ProductDto> products)
        {
            using var doc = JsonDocument.Parse(responseBody);
            var root = doc.RootElement;
            
            var candidates = root.GetProperty("candidates");
            if (candidates.ValueKind != JsonValueKind.Array || candidates.GetArrayLength() == 0)
            {
                throw new InvalidOperationException("Invalid or empty candidates from Gemini API.");
            }

            var jsonText = candidates[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
            if (string.IsNullOrWhiteSpace(jsonText))
            {
                return new List<RecommendationItem>();
            }

            jsonText = jsonText.Trim();
            if (jsonText.StartsWith("```json", StringComparison.OrdinalIgnoreCase)) jsonText = jsonText.Substring(7);
            else if (jsonText.StartsWith("```", StringComparison.OrdinalIgnoreCase)) jsonText = jsonText.Substring(3);
            if (jsonText.EndsWith("```", StringComparison.OrdinalIgnoreCase)) jsonText = jsonText.Substring(0, jsonText.Length - 3);
            jsonText = jsonText.Trim();

            using var innerDoc = JsonDocument.Parse(jsonText);
            var recs = innerDoc.RootElement.GetProperty("recommendations");

            var results = new List<RecommendationItem>();
            var productMap = products.ToDictionary(p => p.Pid);

            foreach (var node in recs.EnumerateArray())
            {
                var pid = node.GetProperty("productId").GetInt32();
                if (productMap.TryGetValue(pid, out var product))
                {
                    results.Add(new RecommendationItem
                    {
                        ProductId = pid,
                        Score = node.GetProperty("score").GetInt32(),
                        Reason = node.GetProperty("reason").GetString(),
                        ProductDetails = product
                    });
                }
            }

            return results.OrderByDescending(r => r.Score).ToList();
        }
    }
}
