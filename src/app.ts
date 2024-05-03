import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { feedsRouter } from "./feeds.routes"
import { dbSqlGetEpisodesToTranscribe } from "./databricks"
import { downloadEpisodeAndTranscribe } from "./transcribeEpisodes"


dotevnv.config()

if (!process.env.PORT) {
    console.log(`No port value specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

app.use('/', feedsRouter)

console.log('Job queued');

setInterval(async () => {
    const results = await dbSqlGetEpisodesToTranscribe();
    const result = results[0];
    console.log('Processing transcribeQueue(' + result.id + '): ', result);

    downloadEpisodeAndTranscribe(result.media_url, result.id);
}, 1000 * 20);


// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})