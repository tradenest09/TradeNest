using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TradeNest.ProductService.Entities
{
    [Table("categories")]
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("cid")]
        public int Cid { get; set; }

        [Required]
        [Column("cname")]
        [MaxLength(100)]
        public string Cname { get; set; }

        [Column("description")]
        [MaxLength(300)]
        public string? Description { get; set; }

        [JsonIgnore]
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
