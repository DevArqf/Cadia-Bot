const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis, channels } = require('../../config')
const { EmbedBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { BugReportBlacklist } = require('../../lib/schemas/bugreportSchema');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Submit a bug report to the Developers of Cadia'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('bug-report')
				.setDescription(this.description)

				// Main cmd
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('send')
						.setDescription('Submit a bug report to the Developer of Cadia')
                .addStringOption(option =>
                    option
                        .setName('issue')
                        .setDescription('Describe the issue(s) you encountered')
                        .setRequired(true))
				.addStringOption(option =>
					option
						.setName('system')
						.setDescription('What command or system did you find this bug in?')
						.setRequired(true))
                .addAttachmentOption(option =>
                    option
                        .setName('image')
                        .setDescription('Attach a image related to the issue you encountered')
                        .setRequired(false))
                .addStringOption(option =>
                    option
                        .setName('notes')
                        .setDescription('Do you have any additional note for the developers?')
                        .setRequired(false)))

				//Blacklist
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('blacklist-user')
						.setDescription('Blacklist a user from executing the bug-report command')
				.addStringOption(option =>
					option
						.setName('user-id')
						.setDescription('The ID of the user')
						.setRequired(true))
				.addStringOption(option =>
					option
						.setName('reason')
						.setDescription('The reason of blacklisting the user')
						.setRequired(false)))
				
				//Un-Blacklist
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('unblacklist-user')
						.setDescription('Unblacklist a user from executing the bug-report command')
				.addStringOption(option =>
					option
						.setName('user-id')
						.setDescription('The ID of the user')
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
				return await interaction.reply(`${emojis.custom.forbidden} You are not **authorized** to **execute** this command!`);
			};

			const userId = interaction.options.getString('user-id');
			const reason = interaction.options.getString('reason') || 'No reason provided';

			if (Number.isNaN(userId)) {
				return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You have **entered** a character that is **not** a number.`)], ephemeral: true });
			};
			const find = await BugReportBlacklist.find({ userID: userId });

			if (find.length === 0) {
				await BugReportBlacklist.create({ userID: userId, reason });
				return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} **Successfully Blacklisted!**\n\`${userId}\` has been **blacklisted** from executing the **bug-report** command\n\n**Reason:**\n ${emojis.custom.replyend} \`${reason}\``)], ephemeral: true});
			}
			return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} **Failed to Backlist!**\n\n\`${userId}\` **cannot** be **blacklisted** from executing the **bug-report** command as they have already been **blacklisted**`)], ephemeral: true});

		}

		if (subcommand === 'unblacklist-user') {
			if (!authorizedIDs.includes(interaction.user.id)) { 
				return await interaction.reply(`${emojis.custom.forbidden} You are not **authorized** to **execute** this command!`);
			};
			const userId = interaction.options.getString('user-id');
			const find = await BugReportBlacklist.find({ userID: userId });

			if (find.length !== 0) {
				await BugReportBlacklist.findOneAndDelete({ userID: userId });
				return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} **Successfully Unblacklisted!**\n\`${userId}\` has been **sucessfully** Unblacklisted`)], ephemeral: true })
			}
			return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} **Failed to Unblacklist!**\n\n\`${userId}\` **cannot** be **blacklisted** from **executing** the **bug-report** command as they have already been **blacklisted**`)], ephemeral: true});

		};

		if (subcommand === 'send') {
			const find = await BugReportBlacklist.find({ userID: interaction.user.id });
			if (find.length !== 0) {
				const blacklistEmbed = new EmbedBuilder()
				.setColor(color.fail)
				.setDescription(`${emojis.custom.warning2} You have been **blacklisted** from **executing** the bug-report command! Please join our discord server [here](https://discord.gg/2XunevgrHD) for more info.`)
				.setTimestamp()
				.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

			return await interaction.reply({ embeds: [blacklistEmbed], ephemeral: true })
			};
			
			const issue = interaction.options.getString('issue');
			const notes = interaction.options.getString('notes') || 'No notes provided';
			const image = interaction.options.getAttachment('image');
			const system = interaction.options.getString('system');
			
			const BugReportChanel = interaction.client.channels.cache.get(channels.bugReports);

		const sentEmbed = new EmbedBuilder()
		.setColor(`${color.random}`)
		.setDescription(`${emojis.custom.success} **Thank you for submitting this bug report.** The Developers will **investigate** the bug **very** soon.\n ${emojis.custom.replyend} ${emojis.custom.warning2} Abusing or misusing this feature will **result** in you getting **blacklisted**!`) // \n\n **Issue:**\n${emojis.custom.replyend} ${issue}\n\n **Notes:**\n${emojis.custom.replyend} ${notes} \n\n**Image:**\n ${image ? `${emojis.custom.replyend} Please look below` : `${emojis.custom.replyend} No picture provided`}\n\n**System:**\n ${emojis.custom.replyend} ${system} **Abusing** this feature will **result** in you getting **blacklisted***!`)
		.addFields([
			{ name: `${emojis.custom.warning1} \`-\` **Bug:**`, value: `${emojis.custom.replyend} ${issue}` },
			{ name: `${emojis.custom.pencil} \`-\` **Notes:**'`, value: `${emojis.custom.replyend} ${notes}` },
			{ name: `${emojis.custom.settings} \`-\` **System:**`, value: `${emojis.custom.replyend} ${system}` },
			{ name: `${emojis.custom.save} \`-\` **Image:**`, value: `${image ? `${emojis.custom.replyend} Please take look below` : `${emojis.custom.replyend} No picture provided`}` }
		])
		.setImage(image ? image.url : null)
		.setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		const devEmbed = new EmbedBuilder()
		.setColor(color.default)
		.setTitle(`${emojis.custom.mail} New Bug Report`)
		.addFields([
			{ name: `${emojis.custom.person} \`-\` **User info:**`, value: `${emojis.custom.replycontinue} **User ID:** ${interaction.user.id}\n${emojis.custom.replyend} **User:** <@${interaction.user.id}>` },
			{ name: `${emojis.custom.warning1} **Bug:**`, value: `${emojis.custom.replyend} ${issue}` },
			{ name: `${emojis.custom.pencil} \`-\` **Notes:**'`, value: `${emojis.custom.replyend} ${notes}` },
			{ name: `${emojis.custom.settings} \`-\` **System:**`, value: `${emojis.custom.replyend} ${system}`},
			{ name: `${emojis.custom.save} \`-\` **Image:**`, value: `${image ? `${emojis.custom.replyend} Please look below` : `${emojis.custom.replyend} No picture provided`}` },
			])
		.setTimestamp()
		.setFooter({ text: `Report submitted by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
		.setImage(image ? image.url : null);
			
			const button = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setEmoji(emojis.custom.success)
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
					
					const user = interaction.user.displayName;
					const newActionRowEmbeds = interaction.message.components.map((oldActionRow) => {
						const updatesActionRow = new ActionRowBuilder();

						updatesActionRow.addComponents(
							oldActionRow.components.map((buttonComponent) => {
								const newButton = new ButtonBuilder()
									.setCustomId(buttonComponent.customId)
									.setLabel(`> ${emojis.custom.success} The **bug** has been **solved** by ${user}`)
									.setStyle(ButtonStyle.Success)
									.setDisabled(true)

							return newButton;
							})
						);
						return updatesActionRow;
					});
					const successEmbed = new EmbedBuilder()
						.setColor(color.success)
						.setDescription(`${emojis.custom.success} **Marked Resolved**\n\nThis bug report has been **successfully** been marked as **resolved**.`)
					await interaction.reply({ embeds: [successEmbed] , ephemeral: true });
					await interaction.message.edit({ components: newActionRowEmbeds });

				} catch (error) {
					console.error(error);
					const errorEmbed = new EmbedBuilder()
							.setColor(color.fail)
							.setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**\n\n > *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
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
