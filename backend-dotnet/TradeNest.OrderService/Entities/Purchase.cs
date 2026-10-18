using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradeNest.OrderService.Entities
{
    public enum PurchaseStatus
    {
        PENDING,
        COMPLETED,
        CANCELLED
    }

    [Table("purchases")]
    public class Purchase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("purchase_id")]
        public int PurchaseId { get; set; }

        [Column("pid")]
        public int Pid { get; set; }

        [Column("buyer_id")]
        public int BuyerId { get; set; }

        [Column("seller_id")]
        public int SellerId { get; set; }

        [Column("purchase_date")]
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public PurchaseStatus Status { get; set; } = PurchaseStatus.PENDING;
    }
}
