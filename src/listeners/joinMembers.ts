import {Listener} from "@sapphire/framework";
import {EmbedBuilder, GuildMember, Snowflake} from "discord.js";

import {newUserMap} from "../userMap";
import {sleep} from "../utils/sleep";

import config from "../../config.json";

export class JoinGuildMember extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "guildMemberAdd"
        });
    }


    public async run(member: GuildMember) {
        console.log(member)
        if (member.guild.id != config.guildId) return

        const joinTime = member.joinedTimestamp
        if (joinTime == null) {
            console.log(`Can't get Member(id: ${member.id}) JoinTime.`)
            return
        }
        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setThumbnail(member.avatarURL() || "https://archive.org/download/discordprofilepictures/discordblue.png")
            .setTitle(`こんにちは！${member.displayName}さん！${member.guild.name}へようこそ！`)
            .setFields({name: "あなたが参加した時刻", value: `<t:${Math.round(joinTime / 1000.0)}:F>`})

        await member.guild.systemChannel?.send({embeds: [embed]})
        newUserMap.set(member.id, joinTime)
        console.log(newUserMap)
        await sleep(60 * 1000)
        console.log(`1 minute passed. deleting Member(id: ${member.id}) joinTime...`)
        newUserMap.delete(member.id)
        console.log("delete complete.")
    }
}

export function getUserMap(): Map<Snowflake, number> {
    console.log(newUserMap)
    return newUserMap
}