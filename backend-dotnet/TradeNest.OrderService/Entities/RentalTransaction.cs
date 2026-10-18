using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradeNest.OrderService.Entities
{
    public enum RentalStatus
    {
        REQUESTED,
        APPROVED,
        ACTIVE,
        COMPLETED,
        CANCELLED,
        PENDING
    }

    [Table("rental_transactions")]
    public class RentalTransaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("rental_id")]
        public int RentalId { get; set; }

        [Column("pid")]
        public int Pid { get; set; }

        [Column("owner_id")]
        public int OwnerId { get; set; }

        [Column("renter_id")]
        public int RenterId { get; set; }

        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Column("total_amount")]
        public decimal TotalAmount { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public RentalStatus Status { get; set; } = RentalStatus.REQUESTED;
    }
}
