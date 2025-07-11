using MoviePortal.Server.Models;
using MoviePortal.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace MoviePortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilmController : ControllerBase
    {
        private readonly FilmService _filmService;

        public FilmController(FilmService filmService)
        {
            _filmService = filmService;
        }

        [Authorize(Roles = "admin,film")]
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularMovies(int page = 1)
        {
            var movies = await _filmService.GetPopularMoviesAsync(page);
            return Ok(movies);
        }

        [Authorize(Roles = "admin,film")]
        [HttpPost("{id}/review")]
        public IActionResult AddReview(int id, [FromBody] FilmReviewRequest request)
        {
            if (request.Rating < 1 || request.Rating > 10)
                return BadRequest("Puan 1 ile 10 arasında olmalı");

            var username = User.Identity?.Name ?? "";

            var existingReview = FilmReviewService.GetUserReview(id, username);
            if (existingReview != null)
                return BadRequest("Zaten bu filme ait bir incelemeniz var.");

            var review = new FilmReview
            {
                Id = new System.Random().Next(1, 1000000),
                FilmId = id,
                Username = username,
                Rating = request.Rating,
                Note = request.Note
            };

            FilmReviewService.AddReview(review);
            return Ok();
        }

        [Authorize(Roles = "admin,film")]
        [HttpPost("{id}/feedback")]
        public async Task<IActionResult> AddFeedback(int id, [FromBody] FeedbackRequest request)
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            await _filmService.AddFeedbackAsync(id, username, request.Puan, request.Not);
            return Ok(new { message = "Geri bildirim kaydedildi." });
        }

        [Authorize(Roles = "film,admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFilmDetails(int id)
        {
            var film = await _filmService.GetMovieByIdAsync(id);
            if (film.ValueKind == System.Text.Json.JsonValueKind.Undefined)
                return NotFound();

            var reviews = FilmReviewService.GetReviewsForFilm(id).ToList();
            var username = User.Identity?.Name ?? "";
            var userReview = FilmReviewService.GetUserReview(id, username);

            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            return Ok(new
            {
                Film = film,
                AverageRating = averageRating,
                UserReview = userReview
            });
        }

        [Authorize(Roles = "film,admin")]
        [HttpGet("search")]
        public async Task<IActionResult> SearchMovies([FromQuery] string query, int page = 1)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                var popular = await _filmService.GetPopularMoviesAsync(page);
                return Ok(popular);
            }

            var result = await _filmService.SearchMoviesAsync(query, page);
            return Ok(result);
        }
        [Authorize]
[HttpPost("suggest")]
public IActionResult SuggestFilm([FromBody] SuggestRequest request)
{
    if (string.IsNullOrWhiteSpace(request.FilmName))
        return BadRequest("Film adı boş olamaz.");

   
    Console.WriteLine($"Önerilen film: {request.FilmName} - Kullanıcı: {User.Identity?.Name}");

    return Ok(new { message = "Film önerisi başarıyla alındı." });
}

public class SuggestRequest
{
    public string FilmName { get; set; }
}

    }

    public class FilmReviewRequest
    {
        public int Rating { get; set; }
        public string? Note { get; set; }
    }

    public class FeedbackRequest
    {
        public int Puan { get; set; }
        public string? Not { get; set; }
    }
}
