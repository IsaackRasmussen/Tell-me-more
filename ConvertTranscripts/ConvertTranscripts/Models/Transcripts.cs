using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ConvertTranscripts.Models;

public class Speakers
{
    [JsonPropertyName("speaker")]
    public string Speaker { get; set; }
    [JsonPropertyName("timestamp")]
    public float?[] Timestamp { get; set; }
    [JsonPropertyName("text")]
    public string Text { get; set; }
}
public class Transcript
{
    [JsonPropertyName("speakers")]
    public Speakers[] Speakers { get; set; }
}