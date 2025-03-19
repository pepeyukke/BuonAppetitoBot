import {ApplicationCommandRegistry, Command} from "@sapphire/framework";
import {EmbedBuilder} from "discord.js";
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
        if (!interaction.guild) {
            await interaction.reply({content: "このコマンドはサーバーでのみ使用できます。", ephemeral: true});
        }
        if (interaction.guildId != config.guildId) {
            await interaction.reply({content: "このコマンドは指定のサーバーでのみ使用できます。", ephemeral: true});
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

        return await interaction.reply({ephemeral: true, embeds: [embed]});
    }
}