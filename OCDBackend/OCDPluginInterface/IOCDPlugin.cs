using System;
using System.Threading.Tasks;

namespace OCDPluginInterface
{
    public interface IOCDCommand
    {
        string Name { get; }
        string CommandName { get; }
        string HelpText { get; }
        Task Execute(string[] commandBody);
    }
}
