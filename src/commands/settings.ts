import {Subcommand} from "@sapphire/plugin-subcommands";
import {MessageFlags, PermissionFlagsBits} from "discord.js";
import {logger} from "../utils/logs";
import {checkGuild} from "../utils/checkGuild";
import {executeRunQuery} from "../utils/database";


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
        if (!await checkGuild(interaction)) return;

        const role = interaction.options.getRole("role");
        if (!role) {
            await interaction.reply({
                content: "エラーが発生しました。ロールオプションを確認して再度実行してください。",
                flags: [MessageFlags.Ephemeral]
            });
            return logger.info(`Failed execute "moderator_role" command by ${interaction.user.tag}. Reason: "role option is empty.`);
        }

        const insertModeratorRoleQuery = `
            INSERT INTO moderatorRole VALUES (?, ?);
        `
        await executeRunQuery("../database/settings.sqlite", insertModeratorRoleQuery, [interaction.guildId, role.id]);
        await interaction.reply({
            content: `モデレーターロールとして**${role.name}**を登録しました`,
            flags: [MessageFlags.Ephemeral]
        })
        return logger.info(`Executed "moderator_role" command by ${interaction.user.tag}.`);
    }
}
