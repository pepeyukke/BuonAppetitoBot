import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import token from "../token.json"

const client = new SapphireClient({
	intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
	loadMessageCommandListeners: true
});

client.login(token.token)