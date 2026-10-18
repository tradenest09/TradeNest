using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;
using TradeNest.ProductService.Services;

namespace TradeNest.ProductService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/reports")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost]
        public async Task<IActionResult> AddReport([FromBody] Report request)
        {
            var response = await _reportService.AddReportAsync(request);
            return Created("", response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReports()
        {
            var response = await _reportService.GetAllReportsAsync();
            return Ok(response);
        }

        [HttpGet("{reportId}")]
        public async Task<IActionResult> GetReportById(int reportId)
        {
            try
            {
                var response = await _reportService.GetReportByIdAsync(reportId);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Report not found" });
            }
        }

        [HttpPut("{reportId}/status")]
        public async Task<IActionResult> UpdateReportStatus(int reportId, [FromBody] UpdateReportStatusRequest request)
        {
            try
            {
                var response = await _reportService.UpdateReportStatusAsync(reportId, request);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Report not found" });
            }
        }

        [HttpDelete("{reportId}")]
        public async Task<IActionResult> DeleteReport(int reportId)
        {
            try
            {
                var response = await _reportService.DeleteReportAsync(reportId);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Report not found" });
            }
        }
    }
}
