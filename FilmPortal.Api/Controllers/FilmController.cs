using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System.Security.Claims;

namespace FilmPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmController : ControllerBase
    {
        private readonly string _tmdbApiKey;
        private readonly string _tmdbUrl;

        public FilmController(IConfiguration configuration)
        {
            _tmdbApiKey = configuration["Tmdb:ApiKey"];
            _tmdbUrl = configuration["Tmdb:BaseUrl"];
        }

        [Authorize]
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularMovies([FromQuery] int page = 1)
        {
            var client = new RestClient(_tmdbUrl);
            var request = new RestRequest($"movie/popular?api_key={_tmdbApiKey}&page={page}");
            var response = await client.ExecuteAsync(request);

            return Ok(response.Content);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(int id)
        {
            var client = new RestClient(_tmdbUrl);
            var request = new RestRequest($"movie/{id}?api_key={_tmdbApiKey}");
            var response = await client.ExecuteAsync(request);

            return Ok(response.Content);
        }

        [Authorize]
        [HttpPost("{id}/rate")]
        public IActionResult RateMovie(int id, [FromBody] RatingDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"User {userId} rated movie {id}: {dto.Rating}, Note: {dto.Note}");

            return Ok(new { Message = "Rating added" });
        }
    }

    public class RatingDto
    {
        public string Note { get; set; }
        public int Rating { get; set; }
    }
}