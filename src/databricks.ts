import { DBSQLClient } from "@databricks/sql";
import IDBSQLSession from '@databricks/sql/dist/contracts/IDBSQLSession';
import IOperation from '@databricks/sql/dist/contracts/IOperation';

export const dbSqlGetFeeds = async function () {
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

export const dbSqlGetFeedsEpisodes = async function () {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(
            'SELECT * FROM tell_me_more.default.feeds_episodes',
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

export const dbSqlGetEpisodesToTranscribe = async function () {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        const queryOperation: IOperation = await session.executeStatement(
            'SELECT * FROM tell_me_more.default.feeds_episodes WHERE transcript IS NULL LIMIT 1',
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