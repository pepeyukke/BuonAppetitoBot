import {ApplicationCommandRegistry, Command} from "@sapphire/framework";
import {EmbedBuilder} from "discord.js";
import {MessageFlags} from "discord.js";

import {commandLog} from "../utils/logs";

import config from "../../config.json"

export class AvatarsCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {...options});
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("avatars")
                .setDescription("アイコンを取得します。")
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('アイコンを取得したいユーザーを指定します。')
                        .setRequired(false)
                )
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        commandLog("avatars", interaction.user)

        if (!interaction.guild) {
            return await interaction.reply({
                content: "このコマンドはサーバーでのみ使用できます。",
                flags: [MessageFlags.Ephemeral]
            });
        }
        if (interaction.guildId != config.guildId) {
            return await interaction.reply({
                content: "このコマンドは指定のサーバーでのみ使用できます。",
                flags: [MessageFlags.Ephemeral]
            });
        }

        let user = interaction.options.getUser('user');
        if (!user) {
            user = interaction.user;
        }

        const embed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle(user.displayName)
            .setImage(user.displayAvatarURL({size: 4096}))
            .setFooter({
                text: `リクエスト元: ${interaction.user.displayName}`,
                iconURL: interaction.user.displayAvatarURL()
            })

        return await interaction.reply({flags: [MessageFlags.Ephemeral], embeds: [embed]});
    }
}