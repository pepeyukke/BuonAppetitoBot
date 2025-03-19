import {User} from "discord.js";

export function commandLog(name: string, user: User): void {
    return console.log(`Executed command "${name}" by ${user.tag}[${user.id}]`);
}