using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WindowsInput;
using WindowsInput.Native;
using NLog;
using TextCopy;

namespace OCDPlugin.Hydrus.Helpers
{
    public class TagsAddResult
    {
        public bool Success { get; set; }
        public string Response { get; set; }

        public TagsAddResult(bool success, string response)
        {
            Success = success;
            Response = response;
        }
    }

    public interface IHydrusAPIClient
    {
        Task<TagsAddResult> AddTags(string[] tags);
    }

    public class HydrusAPIClient : IHydrusAPIClient
    {
        private readonly Logger _logger = LogManager.GetCurrentClassLogger();

        private readonly HttpClient _client;
        private readonly VirtualKeyCode[] _hashCopyKeyStrokeModifiers;
        private readonly VirtualKeyCode _hashCopyKeyStrokeKey;

        public HydrusAPIClient(Uri apiUri, string apiKey, string[] hashCopyKeyStroke)
        {
            _client = new HttpClient();
            _client.BaseAddress = apiUri;
            _client.DefaultRequestHeaders.Add("Hydrus-Client-API-Access-Key", apiKey);

            _hashCopyKeyStrokeModifiers = new VirtualKeyCode[2];
            for (int i = 0; i < 2; i++)
            {
                _hashCopyKeyStrokeModifiers[i] = Enum.Parse<VirtualKeyCode>(hashCopyKeyStroke[i]);
            }
            _hashCopyKeyStrokeKey = Enum.Parse<VirtualKeyCode>(hashCopyKeyStroke[2]);
        }

        public async Task<TagsAddResult> AddTags(string[] tags)
        {
            InputSimulator inputSimulator = new InputSimulator();

            //TODO: Load from config
            inputSimulator.Keyboard.ModifiedKeyStroke(_hashCopyKeyStrokeModifiers, _hashCopyKeyStrokeKey);
            await Task.Delay(100);
            inputSimulator.Keyboard.ModifiedKeyStroke(_hashCopyKeyStrokeModifiers, _hashCopyKeyStrokeKey);
            await Task.Delay(100);
            inputSimulator.Keyboard.ModifiedKeyStroke(_hashCopyKeyStrokeModifiers, _hashCopyKeyStrokeKey);

            string fileHash = await ClipboardService.GetTextAsync();

            _logger.Debug($"HASH FROM CLIPBOARD: {fileHash}");

            var stringBuilder = new StringBuilder();
            stringBuilder.Append("{\"hash\":\"");
            stringBuilder.Append(fileHash);
            stringBuilder.Append("\",");
            stringBuilder.Append("\"service_names_to_tags\": {\"my tags\": [");
            foreach (string tag in tags)
            {
                stringBuilder.Append($"\"{tag}\",");
            }

            stringBuilder.Remove(stringBuilder.Length - 1, 1);

            stringBuilder.Append("]}}");
            _logger.Debug($"Request payload: {stringBuilder}");

            var httpContent = new StringContent(stringBuilder.ToString());
            httpContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            var response = await _client.PostAsync("/add_tags/add_tags", httpContent);
            string responseBody = await response.Content.ReadAsStringAsync();
            bool success = false;
            if (!response.IsSuccessStatusCode)
            {
                Console.Beep(261, 100);
                Console.Beep(554, 100);
                Console.Beep(261, 100);
                Console.WriteLine("Error:");
                Console.WriteLine(responseBody);
                success = false;
            }
            else
            {
                Console.Beep(554, 100);
                Console.Beep(554, 100);
                Console.WriteLine("Success");
                success = true;
            }

            return new TagsAddResult(success, responseBody); //Not used
        }
    }
}