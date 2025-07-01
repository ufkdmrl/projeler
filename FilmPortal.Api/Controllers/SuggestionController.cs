using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FilmPortal.Api.Controllers
{
    [ApiController]
    [Route("api/suggestions")]
    public class SuggestionController : ControllerBase
    {
        [Authorize]
        [HttpPost]
        public IActionResult Suggest([FromBody] SuggestionDto dto)
        {
            Console.WriteLine($"Film önerildi: {dto.MovieName}");
            return Ok(new { Message = "Teşekkür ederiz!" });
        }
    }

    public class SuggestionDto
    {
        public string MovieName { get; set; }
    }
}