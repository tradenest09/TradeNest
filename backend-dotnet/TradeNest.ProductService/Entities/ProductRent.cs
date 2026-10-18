using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TradeNest.ProductService.Entities
{
    [Table("product_rent")]
    public class ProductRent
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("prid")]
        public int Prid { get; set; }

        [Column("pid")]
        public int Pid { get; set; }

        [ForeignKey("Pid")]
        [JsonIgnore]
        public Product? Product { get; set; }

        [Column("no_of_days")]
        public int? NoOfDays { get; set; }

        [Column("charge_per_day")]
        public decimal ChargePerDay { get; set; }

        [Column("security_deposit")]
        public decimal SecurityDeposit { get; set; }
    }
}
