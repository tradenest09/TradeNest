using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradeNest.UserService.Entities
{
    public enum ComplaintStatus
    {
        OPEN,
        IN_PROGRESS,
        CLOSED
    }

    [Table("complaints")]
    public class Complaint
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("complaint_id")]
        public int ComplaintId { get; set; }

        [Column("uid")]
        public int Uid { get; set; }

        [ForeignKey("Uid")]
        public User User { get; set; }

        [Column("subject")]
        [StringLength(200)]
        [Required]
        public string Subject { get; set; }

        [Column("description", TypeName = "TEXT")]
        [Required]
        public string Description { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public ComplaintStatus Status { get; set; } = ComplaintStatus.OPEN;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("resolved_at")]
        public DateTime? ResolvedAt { get; set; }
    }
}
