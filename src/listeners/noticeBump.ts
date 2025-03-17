import {Listener} from '@sapphire/framework';
import {Message, EmbedBuilder} from "discord.js";
import config from "../../config.json";


export class ReadyListener extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: 'messageCreate'
        });
    }

    public async run(message: Message) {
        if (!message.guild) return;
        if (message.guildId != config.guildId) return;
        if (message.author.id != config.noticeBump.disboardUserId) return;
        if (!message.embeds) return;
        const botMessageEmbed = message.embeds[0];
        if (!botMessageEmbed.description) return;
        if (!botMessageEmbed.description.includes("表示順をアップしたよ")) return;

        const executeEmbed = new EmbedBuilder()
            .setColor(0x28b463)
            .setTitle("「</bump:947088344167366698>」が実行されました！")
            .addFields(
                {name: "実行された日時", value: formatNextBump(new Date())},
                {name: "次回実行可能になる日時", value: formatNextBump(calculateNextBump())}
            )

        // @ts-ignore
        await message.channel.send({embeds: [executeEmbed]});
        await sleep(2);
    }
}

function calculateNextBump(): Date {
    const now = new Date();
    return new Date(now.getTime() + 7200000);
}

function formatNextBump(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}時${formattedMinutes}分${formattedSeconds}秒`;
}

function sleep(hours: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, hours * 60 * 60 * 1000));
}