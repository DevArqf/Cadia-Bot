const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis, channels } = require('../../../config')
const { EmbedBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { BugReportBlacklist } = require('../../../lib/schemas/bug-report');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
            name: 'Bug-Report',
			description: 'Send a bug report to the Developers from your server',
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)

				// Main cmd
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('send')
						.setDescription('Send a bug report to the Developers from your server')
                .addStringOption(option =>
                    option
                        .setName('issue')
                        .setDescription('Discribe the issue your having')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option
                        .setName('picture')
                        .setDescription('Attach a picture related to the issue your having')
                        .setRequired(false))
                .addStringOption(option =>
                    option
                        .setName('notes')
                        .setDescription('Do you have any notes for the developers?')
                        .setRequired(false)))

				//Blacklist
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('blacklist-user')
						.setDescription('Blacklist a user from running the bug-report command')
				.addStringOption(option =>
					option
						.setName('user-id')
						.setDescription('The is of the user to blacklist')
						.setRequired(true))
				.addStringOption(option =>
					option
						.setName('reason')
						.setDescription('Why are you blacklisting this user?')
						.setRequired(true)))
				
				//Un-Blacklist
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('unblacklist-user')
						.setDescription('Un-blacklist a user from running the bug-report command')
				.addStringOption(option =>
					option
						.setName('user-id')
						.setDescription('The is of the user to un-blacklist')
						.setRequired(true))),
        );
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const { DEVELOPERS } = process.env;
		const authorizedIDs = DEVELOPERS.split(' ');

		if (subcommand === 'blacklist-user') {
			if (!authorizedIDs.includes(interaction.user.id)) { 
				return await interaction.reply(`${emojis.custom.fail} You are not **authorized** to **execute** this command!`);
			};

			const userId = interaction.options.getString('user-id');
			const reason = interaction.options.getString('reason');

			if (Number.isNaN(userId)) {
				return await interaction.reply({ content: `${emojis.custom.fail} You have inputed a character that is not a number.`, ephemeral: true });
			};
			const find = await BugReportBlacklist.find({ userID: userId });

			if (find.length === 0) {
				await BugReportBlacklist.create({ userID: userId, reason });
				return await interaction.reply({ content: `${emojis.reg.success} Blacklist Success!!\n UserId: ${userId} is now blacklisted from running the bug-report command.\nReason: \`${reason}\``, ephemeral: true});
			}
			return await interaction.reply({ content: `${emojis.reg.success} Blacklist Fail!!\n UserId: ${userId} cant be blacklisted from running the bug-report command as they are blacklisted already.`, ephemeral: true});

		}

		if (subcommand === 'unblacklist-user') {
			if (!authorizedIDs.includes(interaction.user.id)) { 
				return await interaction.reply(`${emojis.custom.fail} You are not **authorized** to **execute** this command!`);
			};
			const userId = interaction.options.getString('user-id');
			const find = await BugReportBlacklist.find({ userID: userId });

			if (find.length !== 0) {
				await BugReportBlacklist.findOneAndDelete({ userID: userId });
				return await interaction.reply({ content: `${emojis.reg.success} Success!!\n\n UserId: ${userId} was sucessfully un blacklisted`, ephemeral: true })
			}
			return await interaction.reply({ content: `${emojis.reg.success} Un-Blacklist Fail!!\n UserId: ${userId} cant be unblacklisted from running the bug-report command as they are not blacklisted.`, ephemeral: true});

		};

		if (subcommand === 'send') {
			const find = await BugReportBlacklist.find({ userID: interaction.user.id });
console.log(find.length)
			if (find.length !== 0) {
				const blacklistEmbed = new EmbedBuilder()
				.setColor(`${color.fail}`)
				.setTitle(`${emojis.reg.fail} Error: Blacklisted`)
				.setDescription(`You have been blacklisted from making bug reports.`)
				.setTimestamp()
				.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

			return await interaction.reply({ embeds: [blacklistEmbed], ephemeral: true })
			};
			
			const issue = interaction.options.getString('issue');
			const notes = interaction.options.getString('notes') || 'No Notes Provided';
			const picture = interaction.options.getAttachment('picture');
			
			const BugReportChanel = interaction.client.channels.cache.get(channels.bugReports);

		const sentEmbed = new EmbedBuilder()
		.setColor(`${color.success}`)
		.setTitle(`${emojis.reg.success} Bug Report`)
		.setDescription(`Thank you for sending this bug report. \nOne our developers will look at this soon.\n\n**Issue:**\n${emojis.custom.replyend} \`${issue}\`\n\n**Notes:**\n${emojis.custom.replyend} \`${notes}\`\n\n**Picture:**\n ${picture ? `${emojis.custom.replyend} Please look below` : `${emojis.custom.replyend} \`No picuture provided\`	`}\n\n **NOTE:**\n${emojis.custom.replyend} \`Abusing this feature will result in you getting blacklisted\``)
		.setImage(picture ? picture : null)
		.setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		const devEmbed = new EmbedBuilder()
		.setColor(`${color.default}`)
		.setTitle('New Bug Report')
		.addFields([
			{ name: '**User info:**', value: `${emojis.custom.replycontinue} **User ID:** ${interaction.user.id}\n${emojis.custom.replyend} **User:** <@${interaction.user.id}>` },
			{ name: '**Issue:**', value: `${emojis.custom.replyend} \`${issue}\`` },
			{ name: '**Notes:**', value: `${emojis.custom.replyend} \`${notes}\`` },
			{ name: '**Picture:**', value: `${picture ? `${emojis.custom.replyend} Please look below` : `${emojis.custom.replyend} No picuture provided`}` },
			])
		.setTimestamp()
		.setImage(picture ? picture : null);
			
			const button = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel("Solved")
					.setStyle(ButtonStyle.Success)
					.setCustomId("solve")
					)
					
					await interaction.reply({ embeds: [sentEmbed] });
					const sendMessage = await BugReportChanel.send({ embeds: [devEmbed], components: [button] });
					
					interaction.client.on('interactionCreate', async (interaction) => {
						if (!interaction.isButton() || interaction.message.id !== sendMessage.id) return;
						
						const { customId } = interaction;
						
						if (customId === 'solve') {
				try {
					await interaction.message.delete();
				} catch (error) {
					console.error(error);
					const errorEmbed = new EmbedBuilder()
							.setColor(`${color.fail}`)
							.setTitle(`${emojis.custom.fail} Solve Error`)
							.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
							.setTimestamp();
							
							return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
						}
					}});
					return;
				};
		}
};

module.exports = {
	UserCommand
};
