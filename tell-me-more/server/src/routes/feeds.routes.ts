import express, { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { dbSqlGetFeeds, dbSqlGetFeedsEpisodes } from "./databricks"

export const feedsRouter = express.Router()

feedsRouter.get("/api/feeds", async (req: Request, res: Response) => {
    try {
        const result = await dbSqlGetFeedsEpisodes();

        return res.status(StatusCodes.OK).json({ result: result })
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    }
})