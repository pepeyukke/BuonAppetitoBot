import {ApplyOptions} from '@sapphire/decorators';
import {Command} from '@sapphire/framework';
import {
    ButtonBuilder,
    EmbedBuilder,
    MessageFlags,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits
} from "discord.js";
import {logger} from "../utils/logs";

@ApplyOptions<Command.Options>({
    name: "settings",
    description: 'ボットの設定をするためのコマンドです。'
})
export class SettingsCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "このコマンドは、サーバー内でのみ実行できます。",
                flags: [MessageFlags.Ephemeral]
            })
            return logger.warn(`Failed execute "${interaction.commandName}" command by ${interaction.user.tag}. Reason: "interaction.guild is null.`)
        }

        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("設定")
            .addFields(
                {
                    name: "サポート",
                    value: "サポート機能に関する設定をします。",
                    inline: true
                }
            )

        const supportButton = new ButtonBuilder()
            .setCustomId("settings:support")
            .setLabel("サポート")
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(supportButton)

        await interaction.reply({
            content: "",
            embeds: [embed],
            components: [row],
            flags: [MessageFlags.Ephemeral]
        })
        return logger.info(`Executed "${interaction.commandName}" command by ${interaction.user.tag}.`)
    }
}
