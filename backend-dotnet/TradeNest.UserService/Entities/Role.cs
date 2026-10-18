using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TradeNest.UserService.Entities
{
    [Table("roles")]
    public class Role
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("rid")]
        public int Rid { get; set; }

        [Required]
        [Column("rname")]
        [MaxLength(50)]
        public string Rname { get; set; }

        [JsonIgnore]
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
