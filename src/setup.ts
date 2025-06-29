import fs from "node:fs";
import {logger} from "./utils/logs";
import path from "node:path";
import sqlite3 from "sqlite3";
import {readFile} from "./utils/readFile";
import {executeRunQuery} from "./utils/database";

export async function setup() {
    const databaseDirectory = path.join(__dirname, "../database");
    try {
        if (!fs.existsSync(databaseDirectory)) {
            fs.mkdirSync(databaseDirectory);
            logger.info(`Created directory: ${databaseDirectory}`);
        } else {
            logger.info(`Directory already exists: ${databaseDirectory}`);
        }
    } catch (err) {
        return logger.error(`Error failed creating directory: "${err}"`);
    }

    const databaseFiles = ["general.sqlite", "support.sqlite"];
    for (const fileName of databaseFiles) {
        const filePath = path.join(databaseDirectory, fileName)
        if (!fs.existsSync(filePath)) {
            const db = new sqlite3.Database(filePath, (err) => {
                if (err) {
                    return logger.error(`Error failed connect database: "${err}"`);
                }
            });
            db.close();
            logger.info(`Created database: ${filePath}`);
        } else {
            logger.info(`Database already exists: ${filePath}`);
        }
    }

    const generalDatabasePath = path.join(databaseDirectory, "general.sqlite");
    const supportDatabasePath = path.join(databaseDirectory, "support.sqlite");
    const sqlDirectory = path.join(__dirname, "../sql");

    const createModeratorRoleTable = await readFile(path.join(sqlDirectory, "createModeratorRoleTable.sql"));
    const createBumpRoleTable = await readFile(path.join(sqlDirectory, "createBumpRoleTable.sql"));
    const createNgWordsTable = await readFile(path.join(sqlDirectory, "createNgWordsTable.sql"));
    const createSupportRoleTable = await readFile(path.join(sqlDirectory, "createSupportRoleTable.sql"));
    const createSupportChannelTable = await readFile(path.join(sqlDirectory, "createSupportChannelTable.sql"));

    if (createModeratorRoleTable) {
        await executeRunQuery(generalDatabasePath, createModeratorRoleTable);
    }
    if (createBumpRoleTable) {
        await executeRunQuery(generalDatabasePath, createBumpRoleTable);
    }
    // --- 追加 ---
    if (createNgWordsTable) {
        await executeRunQuery(generalDatabasePath, createNgWordsTable);
    }
    // --- 追加終 ---
    if (createSupportRoleTable) {
        await executeRunQuery(supportDatabasePath, createSupportRoleTable);
    }
    if (createSupportChannelTable) {
        await executeRunQuery(supportDatabasePath, createSupportChannelTable);
    }

    return logger.info("Setup completed");
}
