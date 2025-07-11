using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MoviePortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SuggestController : ControllerBase
    {
        [HttpPost]
        public IActionResult SuggestFilm([FromBody] SuggestRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FilmName))
                return BadRequest("Film adı boş olamaz.");

            var username = User.Identity?.Name ?? "anonymous";

            
            Console.WriteLine($"{username} adlı kullanıcı '{request.FilmName}' filmini önerdi.");

            return Ok(new { Message = "Film önerisi alındı.", SuggestedFilm = request.FilmName });
        }
    }

    public class SuggestRequest
    {
        public string FilmName { get; set; } = "";
    }
}
