using Microsoft.AspNetCore.Mvc;
using midi2027.API.Models;
using midi2027.API.Services;

namespace midi2027.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly MapLocationService _locationService;
        private readonly IConfiguration _configuration;

        public LocationsController(MapLocationService locationService, IConfiguration configuration)
        {
            _locationService = locationService;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<List<MapLocation>>> GetAll()
        {
            var locations = await _locationService.GetAllAsync();
            return Ok(locations);
        }

        [HttpPost]
        public async Task<ActionResult<MapLocation>> Create([FromBody] CreateUpdateLocationDto dto)
        {
            if (!IsAuthorizedAdmin()) return Unauthorized(new { message = "Neteisingas admin raktas." });

            var created = await _locationService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<MapLocation>> Update(Guid id, [FromBody] CreateUpdateLocationDto dto)
        {
            if (!IsAuthorizedAdmin()) return Unauthorized(new { message = "Neteisingas admin raktas." });

            var updated = await _locationService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            if (!IsAuthorizedAdmin()) return Unauthorized(new { message = "Neteisingas admin raktas." });

            var deleted = await _locationService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        private bool IsAuthorizedAdmin()
        {
            var expectedKey = _configuration["AdminApiKey"];
            if (string.IsNullOrEmpty(expectedKey)) return false;

            return Request.Headers.TryGetValue("X-Admin-Key", out var providedKey) && providedKey == expectedKey;
        }
    }
}