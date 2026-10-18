using System;
using TradeNest.UserService.Entities;

namespace TradeNest.UserService.DTOs
{
    public class AddComplaintRequest
    {
        public int Uid { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
    }

    public class ComplaintResponse
    {
        public int ComplaintId { get; set; }
        public int Uid { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public class UpdateComplaintStatusRequest
    {
        public string Status { get; set; }
    }
}
