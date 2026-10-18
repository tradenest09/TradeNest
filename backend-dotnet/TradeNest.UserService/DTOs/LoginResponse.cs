using TradeNest.UserService.Enums;

namespace TradeNest.UserService.DTOs
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string Type { get; set; } = "Bearer";
        public int Uid { get; set; }
        public string Uname { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
        public string Role { get; set; }
        public UserStatus Status { get; set; }
    }
}
