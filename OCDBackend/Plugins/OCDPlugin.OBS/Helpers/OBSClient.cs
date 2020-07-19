using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using OBSWebsocketDotNet;

namespace OCDPlugin.OBS.Helpers
{
    public interface IOBSClient
    {
        Task Execute(string command, string parameter);
        Task ToggleStatus();
    }

    public class OBSClient : IOBSClient
    {
        private OBSWebsocket _obs;
        private Timer _timer;

        public OBSClient()
        {
            _obs = new OBSWebsocket();
            _obs.Connected += ObsOnConnected;
            _obs.Disconnected += ObsOnDisconnected;
            _timer = new Timer(10000);
            _timer.Elapsed += TimerOnElapsed;
            _timer.Enabled = false;
        }

        private void ObsOnDisconnected(object sender, EventArgs e)
        {
            Console.WriteLine("[OBS] Disconnected");
        }

        private void ObsOnConnected(object sender, EventArgs e)
        {
            Console.WriteLine("[OBS] Connected");
        }

        private void TimerOnElapsed(object sender, ElapsedEventArgs e)
        {
            if (!_obs.IsConnected)
            {
                _obs.Connect("ws://localhost:4444", "");
            }
        }

        public async Task Execute(string command, string parameter)
        {
            if (!_obs.IsConnected)
                return;

            if (command == "scene")
            {
                _obs.SetCurrentScene(parameter);
            }
        }

        public async Task ToggleStatus()
        {
            _timer.Enabled = !_timer.Enabled;
            if (_timer.Enabled)
                TimerOnElapsed(this, null);
            else if (_obs.IsConnected)
                _obs.Disconnect();
        }
    }
}
