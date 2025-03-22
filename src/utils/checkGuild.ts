import {Command} from "@sapphire/framework";
import {Subcommand} from "@sapphire/plugin-subcommands";
import {MessageFlags} from "discord.js";
import {logger} from "./logs";

export async function checkGuild(interaction: Command.ChatInputCommandInteraction | Subcommand.ChatInputCommandInteraction): Promise<boolean> {
    if (!interaction.guild) {
        await interaction.reply({
            content: "このコマンドはサーバーでのみ使用できます。",
            flags: [MessageFlags.Ephemeral]
        });
        logger.info(`Failed execute "${interaction.commandName}" command by ${interaction.user.tag}. Reason: "interaction.guild is null.`)
        return false;
    }
    return true;
}