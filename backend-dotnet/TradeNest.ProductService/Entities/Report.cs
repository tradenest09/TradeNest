using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TradeNest.ProductService.Enums;

namespace TradeNest.ProductService.Entities
{
    [Table("reports")]
    public class Report
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("report_id")]
        public int ReportId { get; set; }

        [Column("pid")]
        public int Pid { get; set; }

        [Column("reporter_id")]
        public int ReporterId { get; set; }

        [Column("reason")]
        public string Reason { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public ReportStatus Status { get; set; }

        [Column("report_date")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? ReportDate { get; set; }
    }
}
