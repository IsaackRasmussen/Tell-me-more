import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { feedsRouter } from "./feeds.routes"
import { dbSqlGetEpisodesToTranscripe } from "./databricks"
import { downloadEpisodeAndTranscripe } from "./transcripeEpisodes"


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
    const results = await dbSqlGetEpisodesToTranscripe();
    console.log('Episodes to transcripe: ', results);
    /*if (results.length > 0) {
        results.array.forEach((result: any) => {
            console.log('Processing transcripeQueue(' + result.id + '): ', result);

            downloadEpisodeAndTranscripe(result.media_url, result.id);
        });
    }*/
}, 1000 * 10);


// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})