const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class BotOwner extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Modify the Bot`s Presence'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('presence')
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('type')
						.setDescription('The presence type')
						.addChoices(
							{ name: '• 🌙 Idle', value: 'Idle' },
							{ name: '• 🟢 Online', value: 'Online' },
							{ name: '• ⭕ DND', value: 'Do not disturb' },
							{ name: '• 👀 Invisible', value: 'Invisible' }
						)
						.setRequired(true)
				)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction, client) {
		try {
			const presence = interaction.options.getString('type');

			const embed = new EmbedBuilder()
				.setTitle("`🔒` Beemo's Presence")
				.setDescription(
					`${emojis.custom.success} Successfully set presence to **${presence}**!\n⠀${emojis.custom.replyend} Please wait up to 5 minutes for the presence to change.`
				)
				.setColor(`${color.default}`)
				.setTimestamp()
				.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

			if (presence === 'Online') {
				interaction.client.user.setPresence({ status: 'online' });
			} else if (presence === 'Idle') {
				interaction.client.user.setPresence({ status: 'idle' });
			} else if (presence === 'Do not disturb') {
				interaction.client.user.setPresence({ status: 'dnd' });
			} else if (presence === 'Invisible') {
				interaction.client.user.setPresence({ status: 'invisible' });
			}

			return await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (error) {
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} Presence Command Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
	}
}

module.exports = {
	BotOwner
};
