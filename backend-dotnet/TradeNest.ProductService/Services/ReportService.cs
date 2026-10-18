using Microsoft.EntityFrameworkCore;
using TradeNest.ProductService.Data;
using TradeNest.ProductService.DTOs;
using TradeNest.ProductService.Entities;
using TradeNest.ProductService.Enums;

namespace TradeNest.ProductService.Services
{
    public interface IReportService
    {
        Task<ReportResponse> AddReportAsync(Report request);
        Task<List<ReportResponse>> GetAllReportsAsync();
        Task<ReportResponse> GetReportByIdAsync(int reportId);
        Task<ReportResponse> UpdateReportStatusAsync(int reportId, UpdateReportStatusRequest request);
        Task<ApiResponse> DeleteReportAsync(int reportId);
    }

    public class ReportServiceImpl : IReportService
    {
        private readonly ProductDbContext _context;

        public ReportServiceImpl(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<ReportResponse> AddReportAsync(Report request)
        {
            var report = new Report
            {
                Pid = request.Pid,
                ReporterId = request.ReporterId,
                Reason = request.Reason,
                Description = request.Description,
                Status = ReportStatus.PENDING
            };

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
            return MapToResponse(report);
        }

        public async Task<List<ReportResponse>> GetAllReportsAsync()
        {
            var reports = await _context.Reports.ToListAsync();
            return reports.Select(MapToResponse).ToList();
        }

        public async Task<ReportResponse> GetReportByIdAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null) throw new KeyNotFoundException("Report not found");
            return MapToResponse(report);
        }

        public async Task<ReportResponse> UpdateReportStatusAsync(int reportId, UpdateReportStatusRequest request)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null) throw new KeyNotFoundException("Report not found");

            report.Status = request.Status;
            await _context.SaveChangesAsync();
            return MapToResponse(report);
        }

        public async Task<ApiResponse> DeleteReportAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null) throw new KeyNotFoundException("Report not found");

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "Report deleted successfully" };
        }

        private ReportResponse MapToResponse(Report report)
        {
            return new ReportResponse
            {
                ReportId = report.ReportId,
                Pid = report.Pid,
                ReporterId = report.ReporterId,
                Reason = report.Reason,
                Description = report.Description,
                Status = report.Status,
                ReportDate = report.ReportDate
            };
        }
    }
}
