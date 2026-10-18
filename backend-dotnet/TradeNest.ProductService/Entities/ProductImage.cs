using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TradeNest.ProductService.Entities
{
    [Table("image_table")]
    public class ProductImage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("image_id")]
        public int ImageId { get; set; }

        [Column("pid")]
        public int Pid { get; set; }

        [ForeignKey("Pid")]
        [JsonIgnore]
        public Product? Product { get; set; }

        [Column("image_url")]
        [MaxLength(500)]
        public string ImageUrl { get; set; } = null!;

        [Column("is_primary")]
        public bool? IsPrimary { get; set; }

        [Column("uploaded_at")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? UploadedAt { get; set; }
    }
}
