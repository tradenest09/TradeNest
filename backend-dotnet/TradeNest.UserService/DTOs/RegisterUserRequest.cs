namespace TradeNest.UserService.DTOs
{
    public class RegisterUserRequest
    {
        public string Uname { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string Fname { get; set; }
        public string Lname { get; set; }
    }
}
