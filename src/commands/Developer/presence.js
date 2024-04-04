const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			permissionLevel: PermissionLevels.Developer,
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
	async chatInputRun(interaction) {
		try {
			const presence = interaction.options.getString('type');

			const embed = new EmbedBuilder()
				.setTitle("`🔒` Beemo's Presence")
				.setDescription( `${emojis.custom.success} **Successfully** set presence to **${presence}**!\n\n > Please wait up to **5 minutes** for the presence to change.`)
				.setColor(color.default)
				.setTimestamp()
				.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

			if (presence === 'Online') {
				interaction.client.user.setPresence({ status: 'online' });
			} else if (presence === 'Idle') {
				interaction.client.user.setPresence({ status: 'idle' });
			} else if (presence === 'Do not disturb') {
				interaction.client.user.setPresence({ status: 'dnd' });
			} else if (presence === 'Invisible') {
				interaction.client.user.setPresence({ status: 'invisible' });
			}

			return await interaction.reply({ embeds: [embed] });
		} catch (error) {
			console.error(error);
			const errorEmbed = new EmbedBuilder()
				.setColor(color.fail)
				.setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
				.setTimestamp();

			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
	}
}

module.exports = {
	UserCommand
};
