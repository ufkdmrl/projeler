using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestSharp;

namespace FilmPortal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OyuncuController : ControllerBase
    {
        private readonly string _tmdbApiKey;
        private readonly string _tmdbUrl;

        public OyuncuController(IConfiguration configuration)
        {
            _tmdbApiKey = configuration["Tmdb:ApiKey"];
            _tmdbUrl = configuration["Tmdb:BaseUrl"];
        }

        [Authorize]
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularActors([FromQuery] int page = 1)
        {
            var client = new RestClient(_tmdbUrl);
            var request = new RestRequest($"person/popular?api_key={_tmdbApiKey}&page={page}");
            var response = await client.ExecuteAsync(request);

            return Ok(response.Content);
        }
    }
}