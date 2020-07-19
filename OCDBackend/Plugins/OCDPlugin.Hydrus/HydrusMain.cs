using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using OCDPlugin.Hydrus.Helpers;
using OCDPluginInterface;

namespace OCDPlugin.Hydrus
{
    public class HydrusMain : IOCDCommand
    {
        public string Name => "Add tags (Hydrus Network)";

        public string CommandName => "hydrus";

        public string HelpText => "This command adds new tag(s) to currently selected file in hydrus client.<br>Usage: [\"tag1\",\"namespace:tag2\", ...]<br>Make sure to configure all required parameters in plugins/hydrus/settings.json! (TODO: add configuration manual)";

        private IHydrusAPIClient _apiClient;

        public HydrusMain()
        {
            //Init config
            IConfiguration config = new ConfigurationBuilder()
                .AddJsonFile(Path.Combine(Path.GetDirectoryName(typeof(HydrusMain).Assembly.Location), "settings.json"), true, false)
                .Build();

            _apiClient = new HydrusAPIClient(new Uri(config["ApiUrl"]), config["ApiKey"], config["HashCopyKeyStroke"].Split('+'));
        }

        public async Task Execute(string[] commandBody)
        {
            if (commandBody == null || commandBody.Length == 0)
                throw new ArgumentException("Tag list cannot be empty");

            await _apiClient.AddTags(commandBody);
        }
    }
}
