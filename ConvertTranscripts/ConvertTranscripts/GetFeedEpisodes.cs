using System.Data.Odbc;
using System.Diagnostics;
using System.Text.Json;
using ConvertTranscripts.Models;

namespace ConvertTranscripts;

public class FeedEpisodes
{
    public async Task Get()
    {
        OdbcConnectionStringBuilder odbcConnectionStringBuilder = new OdbcConnectionStringBuilder
        {
            Driver = "Simba Spark ODBC Driver"
        };
        odbcConnectionStringBuilder.Add("Host", "*.cloud.databricks.com");
        odbcConnectionStringBuilder.Add("Port", "443");
        odbcConnectionStringBuilder.Add("SSL", "1");
        odbcConnectionStringBuilder.Add("ThriftTransport", "2");
        odbcConnectionStringBuilder.Add("AuthMech", "3");
        odbcConnectionStringBuilder.Add("UID", "token");
        odbcConnectionStringBuilder.Add("PWD", "*");
        odbcConnectionStringBuilder.Add("HTTPPath", "sql/1.0/warehouses/*");


        using (OdbcConnection connection = new OdbcConnection(odbcConnectionStringBuilder.ConnectionString))
        {
            string sqlQuery = "select * from tell_me_more.default.feeds_episodes";
            OdbcCommand command = new OdbcCommand(sqlQuery, connection);
            connection.Open();
            OdbcDataReader reader = command.ExecuteReader();

            using (var sw = new StreamWriter("C:\\Projects\\Hackatons\\Databricks\\transform_files.cmd"))
            {
                while (await reader.ReadAsync())
                {
                    var mediaUrl = reader.GetString(reader.GetOrdinal("media_url"));
                    var fileId = reader.GetInt64(reader.GetOrdinal("id"));

                    await DownloadFile(mediaUrl, fileId.ToString());

                    var mediaFilePath = Path.Combine("C:\\Projects\\Hackatons\\Databricks\\Media", fileId + ".mp3");
                    var metaFilePath = Path.Combine("C:\\Projects\\Hackatons\\Databricks\\Media", fileId + ".json");

                    sw.WriteLine($"insanely-fast-whisper --file-name \"{mediaFilePath}\" --transcript-path \"{metaFilePath}\" --batch-size 4 --hf-token *");
                    /*var startInfo = new ProcessStartInfo("insanely-fast-whisper",
                        $"--file-name \"{mediaFilePath}\" --transcript-path \"{metaFilePath}\" --batch-size 4 --hf-token *");
                    startInfo.RedirectStandardOutput = false;

                    Console.WriteLine("Transcribing file: " + mediaFilePath);
                    await Process.Start(startInfo).WaitForExitAsync();*/
                }
            }

            for (int i = 0; i < reader.FieldCount; i++)
            {
                Console.Write(reader.GetName(i) + "\t");
            }

            Console.Write("\n");

            reader.Close();
            command.Dispose();
        }
    }

    private async Task DownloadFile(string url, string fileId)
    {
        try
        {
            var filePath = Path.Combine("C:\\Projects\\Hackatons\\Databricks\\Media", fileId + ".mp3");
            using (var fileStream = new FileStream(filePath, FileMode.OpenOrCreate))
            {
                fileStream.SetLength(0);

                using (var client = new HttpClient())
                {
                    var urlStream = await client.GetStreamAsync(url);
                    var bytesBuffer = new byte[1024 * 1024];
                    int bytesRead = 0;
                    do
                    {
                        bytesRead = await urlStream.ReadAsync(bytesBuffer, 0, bytesBuffer.Length);
                        await fileStream.WriteAsync(bytesBuffer, 0, bytesRead);
                    } while (bytesRead > 0);
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }

    private async Task TransformMeta(string fileName)
    {
        using (var reader = new StreamReader(fileName))
        {
            var transcript = JsonSerializer.Deserialize<Transcript>(reader.ReadToEnd());

            var fInfo = new FileInfo(fileName);
            var tranformedFilename = Path.Combine(fInfo.DirectoryName, "transformed",
                Path.GetFileNameWithoutExtension(fInfo.Name) + "_transformed" + fInfo.Extension);

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
}
