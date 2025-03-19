import {Listener} from "@sapphire/framework";
import {EmbedBuilder, GuildMember, PartialGuildMember} from "discord.js";

import {newUserMap} from "../userMap";
import {date2Timestamp} from "../utils/dateUtil";

import config from "../../config.json";

export class ExitGuildMember extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "guildMemberRemove"
        });
    }

    public async run(member: GuildMember | PartialGuildMember) {
        if (member.guild.id != config.guildId) return
        const date = new Date().getTime()
        const joinDate = newUserMap.get(member.id)

        if (joinDate == undefined) {
            console.log(`Can't get Member(id: ${member.id}) join date.`)
            return
        }

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("即抜けRTA!")
            .addFields(
                {name: "記録: ", value: `${(date - joinDate) / 1000}秒！`},
                {name: "参加時刻/退出時刻", value: `${date2Timestamp(joinDate, "T")}/${date2Timestamp(date, "T")}`}
            )
            .setFooter({
                text: `走者: ${member.displayName}`,
                iconURL: member.avatarURL.toString() || "https://archive.org/download/discordprofilepictures/discordblue.png"
            })

        await member.guild.systemChannel?.send({embeds: [embed]})
    }
}

