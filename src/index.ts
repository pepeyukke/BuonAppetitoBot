import {SapphireClient} from "@sapphire/framework";
import {GatewayIntentBits} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import sqlite3 from "sqlite3"
import {logger} from "./utils/logs";

const createModeratorRoleTable = `
CREATE TABLE IF NOT EXISTS moderatorRole (
    guildId TEXT NOT NULL,
    roleId TEXT NOT NULL
);
`
const createBumpRoleTable = `
CREATE TABLE IF NOT EXISTS bumpRole (
    guildId TEXT NOT NULL,
    roleId TEXT NOT NULL
)
`

async function start(): Promise<void> {
    const databaseDirectory = path.join(__dirname, "..", "database");
    try {
        if (!fs.existsSync(databaseDirectory)) {
            fs.mkdirSync(databaseDirectory);
        }
    } catch (err) {
        return logger.error(`Error failed creating directory: "${err}"`);
    }

    const databaseFiles = ["settings.sqlite"];
    databaseFiles.forEach((fileName) => {
        try {
            const filePath = path.join(databaseDirectory, fileName);
            if (!fs.existsSync(filePath)) {
                const db = new sqlite3.Database(filePath);
                db.close()
                logger.info(`Created database file: ${filePath}`);
            } else {
                logger.info(`Database file already exists: ${filePath}`);
            }
        } catch (e) {
            return logger.error(`Error failed creating database file: "${e}"`);
        }
    })

    await createDatabase(path.join(databaseDirectory, "settings.sqlite"), createModeratorRoleTable, "settings.sqlite");
    await createDatabase(path.join(databaseDirectory, "settings.sqlite"), createBumpRoleTable, "settings.sqlite");

    const token = process.env.BUON_APPETITO_TOKEN;
    if (!token) {
        return logger.error("No token found");
    }

    const client = new SapphireClient({
        intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
        loadMessageCommandListeners: true
    });

    await client.login(token);
}

start();

async function createDatabase(filePath: string, query: string, dbName: string) {
    const db = new sqlite3.Database(filePath, (err) => {
        if (err) {
            return logger.error(`Error creating database: "${err}"`);
        }
    });
    db.run(query, (err) => {
        if (err) {
            return logger.error(`Error creating database: "${err}"`);
        } else {
            return logger.info(`Created database: ${dbName}`);
        }
    });
}