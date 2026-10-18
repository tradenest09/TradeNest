using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TradeNest.UserService.Data;
using TradeNest.UserService.DTOs;
using TradeNest.UserService.Entities;

namespace TradeNest.UserService.Services
{
    public interface IComplaintService
    {
        Task<ComplaintResponse> AddComplaintAsync(AddComplaintRequest request);
        Task<List<ComplaintResponse>> GetAllComplaintsAsync();
        Task<List<ComplaintResponse>> GetComplaintsByUserAsync(int uid);
        Task<ComplaintResponse> UpdateStatusAsync(int complaintId, ComplaintStatus status);
        Task<ApiResponse> DeleteComplaintAsync(int complaintId);
    }

    public class ComplaintServiceImpl : IComplaintService
    {
        private readonly UserDbContext _context;

        public ComplaintServiceImpl(UserDbContext context)
        {
            _context = context;
        }

        public async Task<ComplaintResponse> AddComplaintAsync(AddComplaintRequest request)
        {
            var user = await _context.Users.FindAsync(request.Uid);
            if (user == null) throw new KeyNotFoundException("User not found");

            var complaint = new Complaint
            {
                Uid = request.Uid,
                Subject = request.Subject,
                Description = request.Description,
                Status = ComplaintStatus.OPEN,
                CreatedAt = DateTime.UtcNow
            };

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            return MapToResponse(complaint);
        }

        public async Task<List<ComplaintResponse>> GetAllComplaintsAsync()
        {
            var complaints = await _context.Complaints.ToListAsync();
            return complaints.Select(MapToResponse).ToList();
        }

        public async Task<List<ComplaintResponse>> GetComplaintsByUserAsync(int uid)
        {
            var complaints = await _context.Complaints.Where(c => c.Uid == uid).ToListAsync();
            return complaints.Select(MapToResponse).ToList();
        }

        public async Task<ComplaintResponse> UpdateStatusAsync(int complaintId, ComplaintStatus status)
        {
            var complaint = await _context.Complaints.FindAsync(complaintId);
            if (complaint == null) throw new KeyNotFoundException("Complaint not found");

            complaint.Status = status;
            if (status == ComplaintStatus.CLOSED)
            {
                complaint.ResolvedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return MapToResponse(complaint);
        }

        public async Task<ApiResponse> DeleteComplaintAsync(int complaintId)
        {
            var complaint = await _context.Complaints.FindAsync(complaintId);
            if (complaint == null) throw new KeyNotFoundException("Complaint not found");

            _context.Complaints.Remove(complaint);
            await _context.SaveChangesAsync();

            return new ApiResponse { Success = true, Message = "Complaint deleted successfully" };
        }

        private ComplaintResponse MapToResponse(Complaint c)
        {
            return new ComplaintResponse
            {
                ComplaintId = c.ComplaintId,
                Uid = c.Uid,
                Subject = c.Subject,
                Description = c.Description,
                Status = c.Status.ToString(),
                CreatedAt = c.CreatedAt,
                ResolvedAt = c.ResolvedAt
            };
        }
    }
}
