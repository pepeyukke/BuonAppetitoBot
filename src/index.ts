import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import token from "../token.json"

const client = new SapphireClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.login(token.token)