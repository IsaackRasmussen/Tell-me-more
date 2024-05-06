import express, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { dbSqlGetFeeds, dbSqlGetFeedsEpisodes, dbSqlGetEpisodeChunks, apiVectorDbSearch, dbSqlGetFeedsAllEpisodes } from "./databricks"

export const feedsRouter = express.Router()

feedsRouter.get("/api/feeds", async (req: Request, res: Response) => {
    try {
        const result = await dbSqlGetFeeds();

        return res.status(StatusCodes.OK).json({ result: result })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})

feedsRouter.get("/api/feeds/:feedId/episodes", async (req: Request, res: Response) => {
    try {
        const result = await dbSqlGetFeedsEpisodes(Number(req.params["feedId"]));

        return res.status(StatusCodes.OK).json({ result: result })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})

feedsRouter.get("/api/feeds/episodes", async (req: Request, res: Response) => {
    try {
        const result = await dbSqlGetFeedsAllEpisodes();

        return res.status(StatusCodes.OK).json({ result: result })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})


feedsRouter.get("/api/feeds/episode", async (req: Request, res: Response) => {
    try {
        const result = await dbSqlGetEpisodeChunks(92);

        return res.status(StatusCodes.OK).json({ result: result })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})


feedsRouter.post("/api/search", async (req: Request, res: Response) => {
    try {
        const result = await apiVectorDbSearch(req.body.Search);

        return res.status(StatusCodes.OK).json({ result: result })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})