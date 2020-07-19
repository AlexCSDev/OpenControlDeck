using System;
using System.Linq;
using System.Threading.Tasks;
using OCDPlugin.OBS.Helpers;
using OCDPluginInterface;

namespace OCDPlugin.OBS
{
    public class OBSMain : IOCDCommand
    {
        public string Name => "OBS command";

        public string CommandName => "obs";

        public string HelpText => "Execute obs command.<br>Usage:<br>* [\"toggle\"] - Connect/disconnect to/from obs<br>*[\"scene:test\"] - Switch scene to scene \"test\".";

        private readonly OBSClient _obsClient;
        public OBSMain()
        {
            _obsClient = new OBSClient();
        }


        public async Task Execute(string[] commandBody)
        {
            if (commandBody == null || commandBody.Length == 0)
                throw new ArgumentException("command list cannot be empty");

            foreach (string command in commandBody)
            {
                if (command == "toggle")
                    await _obsClient.ToggleStatus();
                else
                {
                    string[] split = command.Split(':');
                    await _obsClient.Execute(split[0], split[1]);
                }
            }
        }
    }
}
