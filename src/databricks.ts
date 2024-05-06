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

export const dbSqlGetEpisodesToTranscripe = async function () {
    return await connectToDbSql(async (session: IDBSQLSession) => {
        await session.executeStatement('DECLARE OR REPLACE VARIABLE reservation_key_value STRING DEFAULT NULL', { runAsync: true, maxRows: 10000 });
        await session.executeStatement('DECLARE OR REPLACE VARIABLE reservation_id STRING DEFAULT NULL', { runAsync: true, maxRows: 10000 });
        await session.executeStatement('SET VAR reservation_key_value=uuid()', { runAsync: true, maxRows: 10000 });
        await session.executeStatement('SET VAR reservation_id = (SELECT id FROM tell_me_more.default.feeds_episodes WHERE transcript IS NULL AND current_timestamp()>=COALESCE(reserved_until,current_timestamp()) LIMIT 1)', { runAsync: true, maxRows: 10000 });
        await session.executeStatement('UPDATE tell_me_more.default.feeds_episodes SET reserved_until=timestampadd(MINUTE,20,current_timestamp()),reservation_key=reservation_key_value WHERE current_timestamp()>=COALESCE(reserved_until,current_timestamp()) AND id=reservation_id', { runAsync: true, maxRows: 10000 });
        const queryOperation: IOperation = await session.executeStatement('SELECT * FROM tell_me_more.default.feeds_episodes WHERE transcript IS NULL AND current_timestamp()<COALESCE(reserved_until,current_timestamp()) AND reservation_key=reservation_key_value', { runAsync: true, maxRows: 10000 });

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