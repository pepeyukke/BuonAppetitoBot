import {SapphireClient} from "@sapphire/framework";
import {GatewayIntentBits} from "discord.js";

const client = new SapphireClient({
    intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
    loadMessageCommandListeners: true
});

const token = process.env.BUON_APPETITO_TOKEN;

if (token) {
    client.login(token)
} else {
    console.error("No token found.")
}