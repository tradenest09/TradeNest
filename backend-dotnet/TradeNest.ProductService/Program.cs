using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ProductDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "server=localhost;database=tradenestdb;user=root;password=root";
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddScoped<IProductService, ProductServiceImpl>();
builder.Services.AddScoped<ICategoryService, CategoryServiceImpl>();
builder.Services.AddScoped<IProductRentService, ProductRentServiceImpl>();
builder.Services.AddScoped<IProductImageService, ProductImageServiceImpl>();
builder.Services.AddScoped<IReportService, ReportServiceImpl>();
builder.Services.AddScoped<IReviewService, ReviewServiceImpl>();

var secretKey = builder.Configuration["Jwt:Secret"] ?? "supersecretkeywhichmustbeverylongformacsha256";
var keyBytes = Convert.FromBase64String(secretKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// Configure static file serving for /uploads
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
var productsUploadsPath = Path.Combine(uploadsPath, "products");
if (!Directory.Exists(productsUploadsPath))
{
    Directory.CreateDirectory(productsUploadsPath);
}

var fileProviders = new List<Microsoft.Extensions.FileProviders.IFileProvider>
{
    new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath)
};

var springUploadsPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "..", "backend", "product-service", "uploads"));
if (Directory.Exists(springUploadsPath))
{
    fileProviders.Add(new Microsoft.Extensions.FileProviders.PhysicalFileProvider(springUploadsPath));
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.CompositeFileProvider(fileProviders),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
