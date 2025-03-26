import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import {
	ChannelType,
	EmbedBuilder,
	MessageFlags,
	ModalSubmitInteraction,
	PermissionFlagsBits
} from 'discord.js';
import {executeGetQuery, executeRunQuery} from "../../utils/database";
import {logger} from "../../utils/logs";

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
})
export class ModalHandler extends InteractionHandler {
	public async run(interaction: ModalSubmitInteraction) {
		await interaction.deferReply({flags: [MessageFlags.Ephemeral]});

		const title = interaction.fields.getTextInputValue("support:contact:modal:title");
		const detail = interaction.fields.getTextInputValue("support:contact:modal:detail")

		if (!interaction.guild) {
			await interaction.editReply({
				content: "サーバー情報の取得に失敗しました。"
			})
			return logger.warn(`Failed to create support channel. Guild not found. by ${interaction.user.tag}.`)
		}

		const countQuery = `
			SELECT MAX(id) AS id
			FROM privateChannel;
		`
		const roleIdQuery = `
			SELECT roleId as id
			FROM supportRole
			WHERE guildId = ?;
		`
		const insertQuery = `
			INSERT INTO privateChannel (channelId)
			VALUES (?);
		`
		try {
			const count = await executeGetQuery("../database/support.sqlite", countQuery, []);
			const row = await executeGetQuery("../database/support.sqlite", roleIdQuery, [interaction.guildId]);
			const role = await interaction.guild?.roles.fetch(row.id);

			if (!role) {
				await interaction.editReply({
					content: "サポーターロールの取得に失敗しました。管理者に問い合わせてください。"
				})
				return logger.error(`Failed to create support channel. Role not found. by ${interaction.user.tag}.`)
			}

			const channel = await interaction.guild?.channels.create({
				name: `support-${count.id + 1}`,
				type: ChannelType.GuildText,
				// @ts-ignore
				parent: interaction.message?.channel.parent,
				topic: `${title}\n${detail}`,
				permissionOverwrites: [
					{
						id: interaction.guild?.roles.everyone.id,
						deny: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: role.id,
						allow: [PermissionFlagsBits.ViewChannel]
					},
					{
						id: interaction.user.id,
						allow: [PermissionFlagsBits.ViewChannel]
					}
				]
			});

			const embed = new EmbedBuilder()
				.setColor("White")
				.setTitle(title)
				.setDescription(detail)

			await channel.send({
				content: `<@&${role.id}> <@${interaction.user.id}>`,
				embeds: [embed]
			})

			await executeRunQuery("../database/support.sqlite", insertQuery, [channel.id])

			await interaction.editReply({
				content: `専用のサポートチャンネルを作成しました！\n${channel.url}`
			})

			return logger.info(`Executed "support:contact:modal" command by ${interaction.user.tag}.`)
		} catch (e) {
			await interaction.editReply({
				content: "エラーが発生しました。管理者に問い合わせてください。"
			})
			return logger.error(`Error occurred while creating support channel: ${e}`)
		}
	}

	public override parse(interaction: ModalSubmitInteraction) {
		if (interaction.customId !== 'support:contact:modal') return this.none();
	
		return this.some();
	}
}
