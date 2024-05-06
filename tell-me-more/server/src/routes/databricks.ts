import { DBSQLClient } from "@databricks/sql";
import IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';
import IOperation from '@databricks/sql/dist/contracts/IOperation';
import { json } from "stream/consumers";
const fs = require('node:fs');

export const dbSqlGetFeeds = async function () {
    try {
        // Try and read cached file first
        const data = fs.readFileSync('./cached_json/feeds.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }

    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(
            'SELECT * FROM tell_me_more.default.feeds',
            {
                runAsync: true,
                maxRows: 10000 // This option enables the direct results feature.
            }
        );

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        console.table(result);

        return result;
    });
}

export const dbSqlGetFeedsEpisodes = async function (feedId: number) {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(
            `SELECT * FROM tell_me_more.default.feeds_episodes WHERE feed_id=${feedId}`,
            {
                runAsync: true,
                maxRows: 10000 // This option enables the direct results feature.
            }
        );

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        return result;
    });
}

export const dbSqlGetFeedsAllEpisodes = async function () {
    try {
        // Try and read cached file first
        const data = fs.readFileSync('./cached_json/feeds_episodes.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }

    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(
            `SELECT * FROM tell_me_more.default.feeds_episodes`,
            {
                runAsync: true,
                maxRows: 10000 // This option enables the direct results feature.
            }
        );

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        return result;
    });
}

export const dbSqlGetEpisodeChunks = async function (id: number) {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(`
        SELECT content,speaker_id,timestamp_start,timestamp_end,
            ai_analyze_sentiment(content) as sentiment,
            ai_extract(content,array('person', 'location', 'organization')) as extracts,
            ai_summarize(content,10) as summarize_short,
            ai_classify(content,ARRAY('provocative','funny','serious','informational','deep','knowledge')) as classification
        FROM tell_me_more.default.transcripts_chunks WHERE media_url='${id}' LIMIT 5`,
            {
                runAsync: true,
                maxRows: 10000 // This option enables the direct results feature.
            }
        );

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        return result;
    });
}

export const dbSqlGetEpisodesToTranscripe = async function () {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement('SELECT * FROM tell_me_more.default.feeds_episodes', { runAsync: true, maxRows: 10000 });

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        return result ?? [];
    });
}

export const dbSqlSetEpisodeTranscription = async function (mediaUrl: string, transcription: string) {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(
            `UPDATE tell_me_more.default.feeds_episodes SET transcription='${transcription}'`,
            {
                runAsync: true,
                maxRows: 10000 // This option enables the direct results feature.
            }
        );

        const result = await queryOperation.fetchAll();

        await queryOperation.close();

        return result;
    });

}

export const apiVectorDbSearch = async function (searchTerms: string) {
    const serverHostname: string = process.env.DATABRICKS_SERVER_HOSTNAME || '';
    const postDataEmbeddings: any = { "input": searchTerms };
    const customHeaders = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.DATABRICKS_TOKEN || 'No token'
    }

    // Get embeddings
    return await fetch(`https://${serverHostname}/serving-endpoints/databricks-bge-large-en/invocations`, { method: "POST", headers: customHeaders, body: JSON.stringify(postDataEmbeddings) })
        .then((response) => response.json())
        .then(async (dataEmbeddings: any) => {
            // Do vector search
            const postDataSearch: any = {
                "query_vector": dataEmbeddings.data[0].embedding,
                "columns": [
                    "media_url",
                    "content",

                ],
                "num_results": 3
            };

            return await fetch(`https://${serverHostname}/api/2.0/vector-search/indexes/tell_me_more.default.transcripts_chunks_self_managed_vs_index/query`, { method: "POST", headers: customHeaders, body: JSON.stringify(postDataSearch) })
                .then((response) => response.json())
                .then((dataSearch: any) => {
                    return dataSearch.result.data_array;
                });
        });

    return [];
}

const connectToDbSql = async function (queryMethodProc: any) {
    const serverHostname: string = process.env.DATABRICKS_SERVER_HOSTNAME || '';
    const httpPath: string = process.env.DATABRICKS_HTTP_PATH || '';
    const token: string = process.env.DATABRICKS_TOKEN || '';

    if (token == '' || serverHostname == '' || httpPath == '') {
        throw new Error("Cannot find Server Hostname, HTTP Path, or personal access token. " +
            "Check the environment variables DATABRICKS_SERVER_HOSTNAME, " +
            "DATABRICKS_HTTP_PATH, and DATABRICKS_TOKEN.");
    }

    const client: DBSQLClient = new DBSQLClient();
    const connectOptions = {
        token: token,
        host: serverHostname,
        path: httpPath
    };

    return await client.connect(connectOptions).then(async client => {
        const session: IDBSQLSession = await client.openSession();
        const result = await queryMethodProc(session);

        await session.close();
        client.close();
        return result;
    })
        .catch((error) => {
            console.log(error);
        });
}