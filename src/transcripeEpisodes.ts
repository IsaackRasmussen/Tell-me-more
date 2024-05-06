const fs = require('fs');
const https = require('follow-redirects').https;
const { exec } = require('child_process');
import { dbSqlSetEpisodeTranscription } from "./databricks"

export const downloadEpisodeAndTranscripe = async function (fileUrl: string, fileId: number) {
    const fileName = `./Media/${fileId}.mp3`;
    fs.access(fileName, fs.constants.F_OK, (err: any) => {
        if (err) {
            console.log('Downloading: ', fileUrl);
            const output = fs.createWriteStream(fileName);
            https.get(fileUrl, (res: any) => {
                console.log('statusCode:', res.statusCode);

                res.pipe(output);
            }).on('error', (e: any) => {
                console.error(e);
            });

        } else {
            console.log('File already exists: ', fileName);
        }
    });

    /*const transcriptFileName = `./Media/${fileId}.json`;
    fs.access(transcriptFileName, fs.constants.F_OK, (err: any) => {
        if (err) {
            transcripeEpisode(fileUrl, fileId);
        }
    });*/
};

const transcripeEpisode = async function (fileUrl: string, fileId: number) {
    console.log(`Executing Insanely Fast Whisper: ${fileId}`);
    const hfToken: string = process.env.HUGGINGFACE_TOKEN || '';
    const cmdStr = `insanely-fast-whisper --file-name "./Media/${fileId}.mp3" --batch-size 4 --transcript-path "./Media/${fileId}.json" --hf-token ${hfToken}`;
    await exec(cmdStr, (err: any, stdout: any, stderr: any) => {
        if (err) {
            // node couldn't execute the command
            console.log('FastWhisper failed: ', err);
            return;
        }
        dbSqlSetEpisodeTranscription(fileUrl, "Transcriped");
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}