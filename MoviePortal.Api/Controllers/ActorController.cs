using MoviePortal.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MoviePortal.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ActorController : ControllerBase
    {
        private readonly ActorService _actorService;

        public ActorController(ActorService actorService)
        {
            _actorService = actorService;
        }
        [Authorize(Roles = "admin,actor")]
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularActors(int page = 1)
        {
            var actors = await _actorService.GetPopularActorsAsync(page);
            return Ok(actors);
        }
        [Authorize(Roles = "admin,actor")]
[HttpGet("search")]
public async Task<IActionResult> SearchActors([FromQuery] string query, int page = 1)
{
    if (string.IsNullOrWhiteSpace(query))
        return BadRequest("Arama terimi boş olamaz.");

    var actors = await _actorService.SearchActorsAsync(query, page);
    return Ok(actors);
}

    }
}
