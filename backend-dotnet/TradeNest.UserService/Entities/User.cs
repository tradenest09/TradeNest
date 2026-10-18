using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TradeNest.UserService.Enums;

namespace TradeNest.UserService.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("uid")]
        public int Uid { get; set; }

        [Required]
        [Column("uname")]
        [MaxLength(100)]
        public string Uname { get; set; }

        [Required]
        [Column("password")]
        [MaxLength(255)]
        public string Password { get; set; }

        [Required]
        [Column("email")]
        [MaxLength(150)]
        public string Email { get; set; }

        [Required]
        [Column("contactnumber")]
        [MaxLength(15)]
        public string ContactNumber { get; set; }

        [Required]
        [Column("fname")]
        [MaxLength(100)]
        public string Fname { get; set; }

        [Required]
        [Column("lname")]
        [MaxLength(100)]
        public string Lname { get; set; }

        [Column("rid")]
        public int Rid { get; set; }

        [ForeignKey("Rid")]
        [JsonIgnore]
        public Role Role { get; set; }

        [Column("created_at")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime? CreatedAt { get; set; }

        [Column("status", TypeName = "varchar(50)")]
        public UserStatus Status { get; set; }
    }
}
