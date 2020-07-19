using System;
using System.Linq;
using System.Threading.Tasks;
using WindowsInput;
using WindowsInput.Native;
using OCDPluginInterface;

namespace OCDPlugin.KeyPress
{
    public class KeyPressMain : IOCDCommand
    {
        public string Name => "Key press";

        public string CommandName => "keypress";

        public string HelpText => "Execute keyboard commands.<br>Usage: [\"O\",\"delay:1000\",\"C\",\"SHIFT+D\"].";

        public async Task Execute(string[] commandBody)
        {
            if (commandBody == null || commandBody.Length == 0)
                throw new ArgumentException("Key press list cannot be empty");

            InputSimulator inputSimulator = new InputSimulator();
            Console.Beep(261, 100);
            foreach (string command in commandBody)
            {
                if (command.Contains("delay"))
                {
                    string[] split = command.Split(":");
                    await Task.Delay(Convert.ToInt32(split[1]));
                }
                else
                {
                    if (command.Contains("+"))
                    {
                        string[] split = command.Split("+");
                        inputSimulator.Keyboard.ModifiedKeyStroke(
                            split.Take(split.Length - 1).Select(x => Enum.Parse<VirtualKeyCode>(x, true)),
                            Enum.Parse<VirtualKeyCode>(split.Last(), true));
                    }
                    else
                    {
                        inputSimulator.Keyboard.KeyPress(Enum.Parse<VirtualKeyCode>(command, true));
                    }
                }
            }
            Console.Beep(554, 100);
        }
    }
}
