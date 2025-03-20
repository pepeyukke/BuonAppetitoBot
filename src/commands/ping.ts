import {Command} from '@sapphire/framework';
import {MessageFlags} from "discord.js";

import {commandLog, logger} from "../utils/logs";
import {isMessageInstance} from '@sapphire/discord.js-utilities';

import config from "../../config.json";

export class PingCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {...options});
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder.setName('ping').setDescription('ボットが動作しているかどうかを確認するためにpingを送信します。')
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {

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

        const msg = await interaction.reply({content: `Ping?`, flags: [MessageFlags.Ephemeral], fetchReply: true});

        if (isMessageInstance(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            await interaction.editReply(`Pong 🏓! (往復にかかった時間: ${diff}ms. ハートビート: ${ping}ms.)`);
            return logger.info(`Executed "ping" command by ${interaction.user.tag} in ${diff}ms.`)
        }

        await interaction.editReply('ping を取得できませんでした :(');
        return logger.error(`Failed to execute "ping" command by ${interaction.user.tag}.`)
    }
}