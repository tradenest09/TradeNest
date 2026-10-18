using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TradeNest.OrderService.Entities
{
    public enum PaymentMethod
    {
        UPI,
        CARD,
        NETBANKING,
        CASH
    }

    public enum PaymentStatus
    {
        PENDING,
        SUCCESS,
        FAILED,
        REFUNDED
    }

    [Table("payments")]
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("payment_id")]
        public int PaymentId { get; set; }

        [Column("purchase_id")]
        public int? PurchaseId { get; set; }

        [ForeignKey("PurchaseId")]
        public Purchase Purchase { get; set; }

        [Column("rental_id")]
        public int? RentalId { get; set; }

        [ForeignKey("RentalId")]
        public RentalTransaction RentalTransaction { get; set; }

        [Column("payer_id")]
        public int PayerId { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("payment_method", TypeName = "varchar(50)")]
        public PaymentMethod PaymentMethod { get; set; }

        [Column("payment_status", TypeName = "varchar(50)")]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.PENDING;

        [Column("transaction_ref")]
        [StringLength(100)]
        public string TransactionRef { get; set; }

        [Column("payment_date")]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }
}

