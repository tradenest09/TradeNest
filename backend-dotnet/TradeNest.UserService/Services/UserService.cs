using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TradeNest.UserService.Data;
using TradeNest.UserService.DTOs;
using TradeNest.UserService.Entities;
using TradeNest.UserService.Enums;

namespace TradeNest.UserService.Services
{
    public interface IUserService
    {
        Task<UserResponse> RegisterUserAsync(RegisterUserRequest request);
        Task<LoginResponse> LoginUserAsync(LoginRequest request);
        Task<UserResponse> GetUserByIdAsync(int uid);
        Task<List<UserResponse>> GetAllUsersAsync();
        Task<UserResponse> UpdateUserAsync(int uid, UpdateUserRequest request);
        Task<ApiResponse> DeleteUserAsync(int uid);
        Task<UserResponse> GetUserByUnameAsync(string uname);
        Task<long> GetTotalUsersAsync();
        Task<ApiResponse> ChangePasswordAsync(string email, ChangePasswordRequest request);
    }

    public class UserServiceImpl : IUserService
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _config;

        public UserServiceImpl(UserDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<UserResponse> RegisterUserAsync(RegisterUserRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Uname == request.Uname))
                throw new Exception("Username already exists");
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Email already exists");
            
            // Assume default role is user, which is rid=2 in typical spring apps. 
            // We should get role by some default logic, but since it's not provided in request, we use 2.
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Rname == "ROLE_USER") 
                       ?? await _context.Roles.FirstOrDefaultAsync();

            var user = new User
            {
                Uname = request.Uname,
                Email = request.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                ContactNumber = request.ContactNumber,
                Fname = request.Fname,
                Lname = request.Lname,
                Rid = role?.Rid ?? 2,
                Status = UserStatus.ACTIVE
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            await _context.Entry(user).Reference(u => u.Role).LoadAsync();

            return MapToResponse(user);
        }

        public async Task<LoginResponse> LoginUserAsync(LoginRequest request)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }
            if(user.Status == UserStatus.BLOCKED)
            {
                throw new UnauthorizedAccessException("User is blocked");
            }

            var token = GenerateJwtToken(user);
            return new LoginResponse
            {
                Token = token,
                Type = "Bearer",
                Uid = user.Uid,
                Uname = user.Uname,
                Email = user.Email,
                ContactNumber = user.ContactNumber,
                Fname = user.Fname,
                Lname = user.Lname,
                Role = user.Role.Rname,
                Status = user.Status
            };
        }

        public async Task<UserResponse> GetUserByIdAsync(int uid)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Uid == uid);
            if (user == null) throw new KeyNotFoundException("User not found");
            return MapToResponse(user);
        }

        public async Task<List<UserResponse>> GetAllUsersAsync()
        {
            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            return users.Select(MapToResponse).ToList();
        }

        public async Task<UserResponse> UpdateUserAsync(int uid, UpdateUserRequest request)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Uid == uid);
            if (user == null) throw new KeyNotFoundException("User not found");

            user.ContactNumber = request.ContactNumber;
            user.Fname = request.Fname;
            user.Lname = request.Lname;

            await _context.SaveChangesAsync();
            return MapToResponse(user);
        }

        public async Task<ApiResponse> DeleteUserAsync(int uid)
        {
            var user = await _context.Users.FindAsync(uid);
            if (user == null) throw new KeyNotFoundException("User not found");
            
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return new ApiResponse { Success = true, Message = "User deleted successfully" };
        }

        public async Task<UserResponse> GetUserByUnameAsync(string uname)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Uname == uname);
            if (user == null) throw new KeyNotFoundException("User not found");
            return MapToResponse(user);
        }

        public async Task<long> GetTotalUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<ApiResponse> ChangePasswordAsync(string email, ChangePasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) throw new KeyNotFoundException("User not found");

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password))
            {
                throw new ArgumentException("Incorrect current password");
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                throw new ArgumentException("New password and confirm password do not match");
            }

            if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.Password))
            {
                throw new ArgumentException("New password cannot be the same as the current password");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return new ApiResponse
            {
                Success = true,
                Message = "Password updated successfully"
            };
        }

        private string GenerateJwtToken(User user)
        {
            var secret = _config["Jwt:Secret"];
            if(string.IsNullOrEmpty(secret)) secret = "supersecretkeywhichmustbeverylongformacsha256";
            var keyBytes = Convert.FromBase64String(secret);
            var key = new SymmetricSecurityKey(keyBytes);

            var roleName = user.Role?.Rname ?? "ROLE_USER";
            var normalizedRole = roleName.StartsWith("ROLE_") ? roleName.Substring(5) : roleName;
            var prefixedRole = roleName.StartsWith("ROLE_") ? roleName : "ROLE_" + roleName;

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Email),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, roleName),
                new Claim(ClaimTypes.Role, normalizedRole),
                new Claim(ClaimTypes.Role, prefixedRole),
                new Claim("role", roleName),
                new Claim("role", normalizedRole),
                new Claim("role", prefixedRole),
                new Claim("uid", user.Uid.ToString()),
                new Claim("userId", user.Uid.ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expirationMs = long.Parse(_config["Jwt:Expiration"] ?? "86400000");

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMilliseconds(expirationMs),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserResponse MapToResponse(User user)
        {
            return new UserResponse
            {
                Uid = user.Uid,
                Uname = user.Uname,
                Email = user.Email,
                ContactNumber = user.ContactNumber,
                Fname = user.Fname,
                Lname = user.Lname,
                Role = user.Role?.Rname ?? "",
                Status = user.Status
            };
        }
    }
}
