import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import {ActionRowBuilder, ButtonInteraction, ChannelSelectMenuBuilder, ChannelType, MessageFlags} from 'discord.js';
import {logger} from "../../../utils/logs";

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const select = new ChannelSelectMenuBuilder()
			.setCustomId("settings:support:channel:select")
			.setPlaceholder("サポートチャンネルを選択してください。")
			.setChannelTypes([ChannelType.GuildText])
			.setMinValues(1)
			.setMaxValues(1)

		const row = new ActionRowBuilder<ChannelSelectMenuBuilder>()
			.addComponents(select)

		await interaction.reply({
			content: "",
			flags: [MessageFlags.Ephemeral],
			components: [row]
		})

		return logger.info(`Executed "settings:support:channel" command by ${interaction.user.tag}.`)
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'settings:support:channel') return this.none();

		return this.some();
	}
}
