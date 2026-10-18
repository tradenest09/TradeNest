using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TradeNest.ProductService.Enums;

namespace TradeNest.ProductService.Entities
{
    [Table("products")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("pid")]
        public int Pid { get; set; }

        [Column("uid")]
        public int Uid { get; set; }

        [Column("cid")]
        public int Cid { get; set; }

        [ForeignKey("Cid")]
        [JsonIgnore]
        public Category? Category { get; set; }

        [Column("pname")]
        [MaxLength(255)]
        public string? Pname { get; set; }

        [Column("pdesc")]
        public string? Pdesc { get; set; }

        [Column("price")]
        public decimal Price { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public ProductStatus Status { get; set; }

        [Column("type", TypeName = "varchar(50)")]
        public ProductType Type { get; set; }

        [Column("created_at")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? CreatedAt { get; set; }

        [JsonIgnore]
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

        [JsonIgnore]
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
