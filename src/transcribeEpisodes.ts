const fs = require('fs');
const https = require('follow-redirects').https;

export const downloadEpisodeAndTranscribe = async function (fileUrl: String, fileId: number) {
    const fileName = './Media/' + fileId + '.mp3';
    fs.access(fileName, fs.constants.F_OK, (err: any) => {
        if (err) {
            console.log('Downloading: ', fileUrl);
            const output = fs.createWriteStream(fileName);
            https.get(fileUrl, (res: any) => {
                console.log('statusCode:', res.statusCode);
                // console.log('headers:', res.headers);

                res.pipe(output);
            }).on('error', (e: any) => {
                console.error(e);
            });

        } else {
            console.log('File already exists: ', fileName);
        }
    });

};