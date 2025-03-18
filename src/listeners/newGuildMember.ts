import {Listener} from "@sapphire/framework";
import { GuildMember} from "discord.js";
import config from "../../config.json";

export class NewGuildMember extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "guildMemberAdd"
        });
    }



    public async run(member: GuildMember) {
        if(member == null) return
        console.log(member)
        if(member.guild.id != config.guildId) return
        const joinTime = member.joinedTimestamp!
        await member.guild.systemChannel?.send(`こんにちは！<@${member.id}>さん！\nあなたは<t:${Math.round(joinTime/1000.0)}:F>に参加しました！`)

    }
}