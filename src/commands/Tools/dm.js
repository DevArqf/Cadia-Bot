const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionFlagsBits } = require('discord.js');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const { UserSettingsSchema } = require('../../lib/schemas/usersettings');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Send a DM to a user within the server'
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
				.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('send')
						.setDescription('Send a direct message to a user')
						.addUserOption((option) => option.setName('user').setDescription('The user that should receive a DM').setRequired(true))
						.addStringOption((option) =>
							option.setName('message').setDescription('The message that the user should receive').setRequired(true)
						)
						.addStringOption((option) => option.setName('reason').setDescription('The reason for the DM'))
				)

				.addSubcommand((subcommand) =>
					subcommand //
						.setName('toggle-dms')
						.setDescription('Toggle receiving DMs')
				)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'send') {
			const user = interaction.options.getUser('user');
			const message = interaction.options.getString('message');
			const reason = interaction.options.getString('reason') || 'No reason provided';

			const userSettings = await UserSettingsSchema.findOne({ userId: user.id });

			if (userSettings && !userSettings.receiveDMs) {
				return interaction.reply({ content: `${emojis.custom.fail} **${user.tag}** has Direct Messages **disabled**!` });
			}

			const embed = new EmbedBuilder()
				.setTitle('`📮` Direct Message Received')
				.setColor(`${color.default}`)
				.addFields(
					{ name: '`📝` Message', value: `${emojis.custom.replyend} ${message}` },
					{ name: '`💻` Server', value: `${emojis.custom.replyend} ${interaction.guild.name}` },
					{ name: '`🔨` Reason', value: `${emojis.custom.replyend} ${reason}` },
					{ name: '`👷‍♂️` Operator', value: `${emojis.custom.replyend} ${interaction.user}` }
				)
				.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() })
				.setTimestamp();

			await user
				.send({ embeds: [embed] })
				.then(() => {
					interaction.reply({ content: `${emojis.custom.success} The message has been **successfully** sent to **${user.tag}**!` });
				})
				.catch(() => {
					interaction.reply({ content: `${emojis.custom.fail} **${user.tag}** has Direct Messages **disabled**!` });
				});
		} else if (subcommand === 'toggle-dms') {
			const currentSettings = await UserSettingsSchema.findOne({ userId: interaction.user.id });

			if (currentSettings) {
				currentSettings.receiveDMs = !currentSettings.receiveDMs;
			} else {
				currentSettings = new UserSettingsSchema({
					userId: interaction.user.id,
					receiveDMs: false
				});
			}

			await currentSettings.save();

			interaction.reply({
				content: `${emojis.custom.success} You have **successfully** toggled your DMs to **${currentSettings.receiveDMs ? 'enabled' : 'disabled'}**!`
			});
		}
	}
}

module.exports = {
	UserCommand
};
