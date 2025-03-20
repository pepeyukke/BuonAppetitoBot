import {Subcommand} from "@sapphire/plugin-subcommands";
import {MessageFlags, PermissionFlagsBits} from "discord.js";
import * as fs from "fs";
import config from "../../config.json";
import {logger} from "../utils/logs";


export class SettingsCommand extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: "settings",
            requiredUserPermissions: [PermissionFlagsBits.ManageGuild],
            subcommands: [
                {
                    name: "moderator_role",
                    chatInputRun: "moderatorRole"
                }
            ]
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName("settings")
                .setDescription("Botの設定用コマンドです。")
                .addSubcommand((command) =>
                    command
                        .setName("moderator_role")
                        .setDescription("Botがモデレーターとして認識するロールを設定します。")
                        .addRoleOption((option) =>
                            option
                                .setName("role")
                                .setDescription("モデレーターロールとして、設定するロールを選択してください。")
                                .setRequired(true)
                        )
                )
        )
    }

    public async moderatorRole(interaction: Subcommand.ChatInputCommandInteraction) {
        if (!interaction.guild) {
            await interaction.reply({
                content: "このコマンドはサーバーでのみ使用できます。",
                flags: [MessageFlags.Ephemeral]
            });
            return logger.warn(`Failed execute "moderator_role" command by ${interaction.user.tag}. Reason: "interaction.guild is null.`);
        }
        if (interaction.guildId != config.guildId) {
            await interaction.reply({
                content: "このコマンドは指定のサーバーでのみ使用できます。",
                flags: [MessageFlags.Ephemeral]
            });
            return logger.warn(`Failed execute "moderator_role" command by ${interaction.user.tag}. Reason: "interaction.guildId is not equal to config.guildId."`)
        }

        const role = interaction.options.getRole("role");
        if (!role) {
            await interaction.reply({
                content: "エラーが発生しました。ロールオプションを確認して再度実行してください。",
                flags: [MessageFlags.Ephemeral]
            });
            return logger.warn(`Failed execute "moderator_role" command by ${interaction.user.tag}. Reason: "role option is empty.`);
        }

        try {
            const filePath = "../config.json";
            const rawData = fs.readFileSync(filePath, "utf-8");
            const jsonData = JSON.parse(rawData);
            jsonData.moderatorRoleId = `${role.id}`;
            const newData = JSON.stringify(jsonData, null, 2);
            fs.writeFileSync(filePath, newData, "utf-8");

            const checkRawData = fs.readFileSync(filePath, "utf-8");
            const checkJsonData = JSON.parse(checkRawData);
            if (checkJsonData.moderatorRoleId != role.id) {
                await interaction.reply({
                    content: ``,
                    flags: [MessageFlags.Ephemeral]
                });
                return logger.error(`Failed execute "moderator_role" command by ${interaction.user.tag}. Reason: "JSON data is not updated.".`);
            }
        } catch (e) {
            await interaction.reply({
                content: "不明なエラーが発生しました。開発者に問い合わせてください。",
                flags: [MessageFlags.Ephemeral]
            })
            return logger.error(`Failed execute "moderator_role" command by ${interaction.user.tag}. Reason: "${e}".`);
        }

        await interaction.reply({
            content: `モデレーターロールを**${role.name}**に設定しました`,
            flags: [MessageFlags.Ephemeral]
        });
        return logger.info(`Executed "moderator_role" command by ${interaction.user.tag}.`);
    }
}
