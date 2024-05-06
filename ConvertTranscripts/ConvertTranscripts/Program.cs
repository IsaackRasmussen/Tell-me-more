// See https://aka.ms/new-console-template for more information

using System.Text.Json;
using ConvertTranscripts;
using ConvertTranscripts.Models;

new FeedEpisodes().Get().GetAwaiter().GetResult();


var jsonFilesNames = Directory.GetFiles("C:\\Projects\\Hackatons\\Databricks\\Media", "*.json");
foreach (var fileName in jsonFilesNames)
{
    using (var reader = new StreamReader(fileName))
    {
       
        var transcript = JsonSerializer.Deserialize<Transcript>(reader.ReadToEnd());

        var fInfo = new FileInfo(fileName);
        var tranformedFilename= Path.Combine(fInfo.DirectoryName,"transformed", Path.GetFileNameWithoutExtension(fInfo.Name) + "_transformed" + fInfo.Extension);

        var transformed = transcript.Speakers.Select(s => new Dictionary<string, object>()
        {
            {
                "speaker", s.Speaker
            },
            {
                "text", s.Text
            },
            {
                "timestamp_start", s.Timestamp[0]
            },
            {
                "timestamp_end", s.Timestamp[1]
            },
            {
                "source", Path.GetFileNameWithoutExtension(fInfo.Name) 
            }
        });
        using (var writer = new StreamWriter(tranformedFilename))
        {
            writer.Write(JsonSerializer.Serialize(transformed));
        }
    }
}