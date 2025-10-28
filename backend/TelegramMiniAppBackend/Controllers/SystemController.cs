using Microsoft.AspNetCore.Mvc;

namespace TelegramMiniAppBackend.Controllers
{
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly ILogger<SystemController> _logger;

        public SystemController(ILogger<SystemController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("/live")]
        public async Task<IActionResult> Live()
        {
            _logger.LogInformation("Live endpoint called");
            return Ok("i'm ok");
        }
    }
}