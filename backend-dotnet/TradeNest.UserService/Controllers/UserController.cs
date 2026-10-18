using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TradeNest.UserService.DTOs;
using TradeNest.UserService.Services;

namespace TradeNest.UserService.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserRequest request)
        {
            try
            {
                var response = await _userService.RegisterUserAsync(request);
                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _userService.LoginUserAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("{uid}")]
        public async Task<IActionResult> GetUserById(int uid)
        {
            try
            {
                var response = await _userService.GetUserByIdAsync(uid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "User not found" });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var response = await _userService.GetAllUsersAsync();
            return Ok(response);
        }

        [Authorize]
        [HttpPut("{uid}")]
        public async Task<IActionResult> UpdateUser(int uid, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var response = await _userService.UpdateUserAsync(uid, request);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "User not found" });
            }
        }

        [Authorize]
        [HttpDelete("{uid}")]
        public async Task<IActionResult> DeleteUser(int uid)
        {
            try
            {
                var response = await _userService.DeleteUserAsync(uid);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "User not found" });
            }
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> GetUserByUname([FromQuery] string uname)
        {
            try
            {
                var response = await _userService.GetUserByUnameAsync(uname);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new ApiResponse { Success = false, Message = "User not found" });
            }
        }

        [Authorize]
        [HttpGet("count")]
        public async Task<IActionResult> GetTotalUsers()
        {
            var count = await _userService.GetTotalUsersAsync();
            return Ok(count);
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? User.FindFirst("sub")?.Value 
                         ?? User.Identity?.Name;
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized(new ApiResponse { Success = false, Message = "Unauthorized" });
                }

                var response = await _userService.ChangePasswordAsync(email, request);
                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse { Success = false, Message = ex.Message });
            }
        }
    }
}
