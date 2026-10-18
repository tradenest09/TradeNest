using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TradeNest.ProductService.Entities
{
    [Table("reviews")]
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("review_id")]
        public int ReviewId { get; set; }

        [Column("pid")]
        public int Pid { get; set; }

        [ForeignKey("Pid")]
        [JsonIgnore]
        public Product? Product { get; set; }

        [Column("uid")]
        public int Uid { get; set; }

        [Column("rating")]
        public int Rating { get; set; }

        [Column("review_text")]
        public string? ReviewText { get; set; }

        [Column("review_date")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? ReviewDate { get; set; }
    }
}
