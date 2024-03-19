const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Send a Anonymous DM to a user within the server'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('dm')
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('The user that should receive a DM').setRequired(true))
				.addStringOption((option) => option.setName('message').setDescription('The message that the user should receive').setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const user = interaction.options.getUser('user');
		const message = interaction.options.getString('message');

		const embed = new EmbedBuilder()
			.setTitle('`📮` Anonymous DM Received')
			.setColor(`${color.default}`)
			.addFields(
				{ name: '`📝` Message', value: `${emojis.custom.replyend} ${message}` },
				{ name: '`💻` Server', value: `${emojis.custom.replyend} ${interaction.guild.name}` }
			)
			.setFooter({ text: `Sent by Anonymous` })
			.setTimestamp();

		await user
			.send({ embeds: [embed] })
			.then(() => {
				interaction.reply({
					content: `${emojis.custom.success} The message has been **successfully** sent to **${user.tag}**!`,
					ephemeral: true
				});
			})
			.catch(() => {
				interaction.reply({ content: `${emojis.custom.fail} **${user.tag}** has Direct Messages **disabled**!`, ephemeral: true });
			});
	}
}

module.exports = {
	UserCommand
};
