using TradeNest.UserService.Enums;

namespace TradeNest.UserService.DTOs
{
    public class UserResponse
    {
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
