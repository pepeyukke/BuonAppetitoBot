import sqlite3 from "sqlite3";
import {logger} from "./logs";

export async function executeGetQuery(dbPath: string, query: string, params: any[] = []): Promise<any | undefined> {
    return new Promise<any | undefined>((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                logger.error(`Error failed connect database: "${err}"`);
                reject(err);
                return;
            }
            db.get(query, params, (err, row) => {
                if (err) {
                    logger.error(`Error failed execute query: "${err}"`);
                    reject(err);
                } else {
                    resolve(row);
                }
                db.close();
            });
        });
    });
}


export async function executeRunQuery(dbPath: string, query: string, params: any[] = []): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(err);
                logger.error(`Error failed connect database: "${err}"`);
                return;
            }
            db.run(query, params, (err) => {
                if (err) {
                    logger.error(`Error failed execute query: "${err}"`);
                    reject(err);
                } else {
                    resolve();
                }
                db.close();
            });
        });
    });
}