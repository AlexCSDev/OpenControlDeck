using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OCDBackend.Helpers;
using OCDPluginInterface;

namespace OCDBackend.Services
{
    public interface IPluginService
    {
        IOCDCommand GetPlugin(string command);
        List<IOCDCommand> GetAllPlugins();
    }

    public class PluginService : IPluginService
    {
        private static readonly string PluginDirectory = Path.Combine(Path.GetDirectoryName(typeof(Program).Assembly.Location), "plugins");
        private readonly Dictionary<string, IOCDCommand> _loadedPlugins;
        private readonly ILogger<PluginService> _logger;

        public PluginService(ILogger<PluginService> logger)
        {
            _logger = logger;

            _loadedPlugins = new Dictionary<string, IOCDCommand>();

            foreach (string filePath in Directory.EnumerateFiles(PluginDirectory, "*.dll", SearchOption.AllDirectories))
            {
                try
                {
                    Assembly assembly = LoadPluginAssembly(filePath);
                    IEnumerable<IOCDCommand> pluginsList = LoadPluginClassesFromAssembly(assembly);
                    foreach (IOCDCommand plugin in pluginsList)
                        _loadedPlugins.Add(plugin.CommandName, plugin);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Unable to load assembly {filePath}");
                }
            }
        }

        private Assembly LoadPluginAssembly(string path)
        {
            string pluginLocation = path.Replace('\\', Path.DirectorySeparatorChar);

            _logger.LogDebug($"Loading assembly file: {pluginLocation}");
            PluginLoadContext loadContext = new PluginLoadContext(pluginLocation);
            return loadContext.LoadFromAssemblyName(new AssemblyName(Path.GetFileNameWithoutExtension(pluginLocation)));
        }

        private IEnumerable<IOCDCommand> LoadPluginClassesFromAssembly(Assembly assembly)
        {
            foreach (Type type in assembly.GetTypes())
            {
                if (typeof(IOCDCommand).IsAssignableFrom(type))
                {
                    if (Activator.CreateInstance(type) is IOCDCommand result)
                    {
                        _logger.LogDebug($"Found new command: {result.CommandName}");
                        yield return result;
                    }
                }
            }
        }

        public List<IOCDCommand> GetAllPlugins()
        {
            return _loadedPlugins.Select(x => x.Value).ToList();
        }

        public IOCDCommand GetPlugin(string command)
        {
            if (!_loadedPlugins.ContainsKey(command))
                return null;

            return _loadedPlugins[command];
        }
    }
}
