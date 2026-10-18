using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TradeNest.AiService.DTOs;
using TradeNest.AiService.Services;

namespace TradeNest.AiService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendations([FromBody] AiRecommendationRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest(new { error = "Query cannot be empty" });
            }

            try
            {
                var items = await _aiService.GetRecommendationsAsync(request.Query);
                return Ok(new AiRecommendationResponse(items));
            }
            catch (System.Exception e)
            {
                return StatusCode(500, new { error = "AI Service Error: " + e.Message });
            }
        }
    }
}
