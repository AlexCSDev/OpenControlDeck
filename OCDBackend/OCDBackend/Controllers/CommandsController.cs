using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OCDBackend.Models;
using OCDBackend.Services;
using OCDPluginInterface;

namespace OCDBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommandsController : ControllerBase
    {
        private readonly IPluginService _pluginService;
        private readonly ILogger<CommandsController> _logger;

        public CommandsController(IPluginService pluginService, ILogger<CommandsController> logger)
        {
            _pluginService = pluginService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get()
        {
            List<IOCDCommand> plugins = _pluginService.GetAllPlugins();
            List<CommandViewModel> commandViewModels = new List<CommandViewModel>(plugins.Count);
            foreach (IOCDCommand plugin in plugins)
            {
                CommandViewModel model = new CommandViewModel();
                model.Name = plugin.Name;
                model.CommandName = plugin.CommandName;
                model.HelpText = plugin.HelpText;

                commandViewModels.Add(model);
            }

            return Ok(commandViewModels);
        }

        [HttpGet("{command}")]
        public IActionResult GetByName(string command)
        {
            IOCDCommand plugin = _pluginService.GetPlugin(command);
            if (plugin == null)
                return NotFound();

            CommandViewModel model = new CommandViewModel();
            model.Name = plugin.Name;
            model.CommandName = plugin.CommandName;
            model.HelpText = plugin.HelpText;

            return Ok(model);
        }

        [HttpPost("{command}")]
        public async Task<IActionResult> Post(string command, [FromBody] string[] commandBody)
        {
            try
            {
                IOCDCommand plugin = _pluginService.GetPlugin(command);
                if (plugin == null)
                    return NotFound();

                await plugin.Execute(commandBody);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

            return Ok();
        }
    }
}
