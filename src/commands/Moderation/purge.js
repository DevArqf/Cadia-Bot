const { PermissionLevels } = require('../../lib/types/Enums');
const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config');

class UserCommand extends BeemoCommand {
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Bulk deletes a given amount of messages. Limit is 100.',
			requiredUserPermissions: ['ManageMessages']
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('purge')
				.setDescription(this.description)
				.addIntegerOption((option) => option.setName('amount').setDescription('Number of messages to purge').setRequired(true))
				.addStringOption((option) =>
					option
						.setName('filter')
						.setDescription('Filter options for purging')
						.setRequired(true)
						.addChoices(
							{ name: 'All', value: 'all' },
							{ name: 'Links', value: 'links' },
							{ name: 'Bot Messages', value: 'bot' },
							{ name: 'Invites', value: 'invites' },
							{ name: 'Attachments', value: 'attachments' },
							{ name: 'Images', value: 'images' }
						)
				)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Retrieving parameters from user interaction
		const amount = interaction.options.getInteger('amount');
		const filter = interaction.options.getString('filter');
		const channel = interaction.channel;

		// Validating the amount of messages to purge
		if (amount < 1 || amount > 100) {
			// Building and sending embed for invalid amount error
			const invalidAmountEmbed = new EmbedBuilder()
				.setColor(`${color.fail}`)
				.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
				.setTitle(`${emojis.reg.fail} Invalid Amount`)
				.setDescription('Please specify a valid number of messages to purge (1-100).')
				.setTimestamp();

			return interaction.reply({ embeds: [invalidAmountEmbed], ephemeral: true });
		}

		let messages;

		try {
			// Fetching and filtering messages based on the provided filter
			switch (filter) {
				case 'links':
					messages = await channel.messages.fetch({ limit: amount });
					messages = messages.filter((msg) => msg.content.includes('http://') || msg.content.includes('https://'));
					break;
				case 'bot':
					messages = await channel.messages.fetch({ limit: amount });
					messages = messages.filter((msg) => msg.author.bot);
					break;
				case 'invites':
					messages = await channel.messages.fetch({ limit: amount });
					messages = messages.filter((msg) => /discord\.gg\/\w+/i.test(msg.content));
					break;
				case 'attachments':
					messages = await channel.messages.fetch({ limit: amount });
					messages = messages.filter((msg) => msg.attachments.size > 0);
					break;
				case 'images':
					messages = await channel.messages.fetch({ limit: amount });
					messages = messages.filter((msg) => msg.attachments.some((attachment) => attachment.name.match(/\.(png|jpe?g|gif)$/i)));
					break;
				case 'all':
				default:
					messages = await channel.messages.fetch({ limit: amount });
					break;
			}

			// Handling cases when no messages found to purge
			if (messages.size === 0) {
				// Building and sending embed for no messages to purge
				const noMessagesEmbed = new EmbedBuilder()
					.setColor(`${color.fail}`)
					.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
					.setTitle(`${emojis.reg.fail} No Messages to Purge`)
					.setDescription(`${emojis.custom.fail} Uh Oh... There are no messages in the channel to purge.`)
					.setTimestamp();

				return interaction.reply({ embeds: [noMessagesEmbed], ephemeral: true });
			}

			// Purging the messages and sending success message
			await channel.bulkDelete([...messages.values()], true);
			const purgeSuccessEmbed = new EmbedBuilder()
				.setColor(`${color.success}`)
				.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
				.setTitle(`${emojis.reg.success} Purge Successful`)
				.setDescription(`${emojis.custom.success} Successfully purged **${messages.size}** message(s).`)
				.setTimestamp();

			interaction.reply({ embeds: [purgeSuccessEmbed], ephemeral: true });
		} catch (error) {
			// Handling errors occurred during the process
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} Purge Command Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
	}
}

module.exports = {
	UserCommand
};
