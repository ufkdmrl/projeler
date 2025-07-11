using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.Google; // Added for GoogleDefaults
using MoviePortal.Server.Models;
using MoviePortal.Server.Services; // Added for TokenService

namespace MoviePortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly List<User> users = new()
        {
            new User { Username = "filmuser", Password = "123456", Role = "film" },
            new User { Username = "actoruser", Password = "123456", Role = "actor" },
            new User { Username = "adminuser", Password = "123456", Role = "admin" },
        };

        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = users.SingleOrDefault(u => u.Username == request.Username && u.Password == request.Password);
            if (user == null)
                return Unauthorized("Kullanıcı adı veya şifre yanlış");

            var token = TokenService.GenerateToken(user);
            return Ok(new { Token = token });
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/api/auth/google-response" };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
                return BadRequest("Google authentication failed");

            var email = authenticateResult.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var name = authenticateResult.Principal.FindFirst(ClaimTypes.Name)?.Value;

            var user = users.SingleOrDefault(u => u.Username == email);
            if (user == null)
            {
                user = new User
                {
                    Username = email ?? string.Empty,
                    Password = string.Empty,
                    Role = "user"
                };
                users.Add(user);
            }

            var token = TokenService.GenerateToken(user);
            return Ok(new { Token = token });
        }

        [HttpPost("google-token")]
        public async Task<IActionResult> GoogleTokenLogin([FromBody] GoogleTokenRequest request)
        {
            if (request?.TokenId == null)
                return BadRequest("Token is required");

            try
            {
                var payload = await VerifyGoogleToken(request.TokenId);
                if (payload == null)
                    return BadRequest("Invalid Google token");

                var email = payload.Email;
                var name = payload.Name;

                var user = users.SingleOrDefault(u => u.Username == email);
                if (user == null)
                {
                    user = new User
                    {
                        Username = email ?? string.Empty,
                        Password = string.Empty,
                        Role = "user"
                    };
                    users.Add(user);
                }

                var token = TokenService.GenerateToken(user);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return BadRequest($"Authentication failed: {ex.Message}");
            }
        }

        private async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string tokenId)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { _configuration["Authentication:Google:ClientId"] }
                };
                return await GoogleJsonWebSignature.ValidateAsync(tokenId, settings);
            }
            catch
            {
                return null;
            }
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class GoogleTokenRequest
    {
        public string TokenId { get; set; } = string.Empty;
    }
}