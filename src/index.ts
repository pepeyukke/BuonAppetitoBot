import {SapphireClient} from "@sapphire/framework";
import {GatewayIntentBits} from "discord.js";
import {logger} from "./utils/logs";

const client = new SapphireClient({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
    loadMessageCommandListeners: true
});

const token = process.env.BUON_APPETITO_TOKEN;

if (token) {
    client.login(token)
} else {
    logger.error("No token found")
}