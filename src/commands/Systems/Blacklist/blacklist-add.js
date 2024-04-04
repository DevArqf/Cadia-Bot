const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { EmbedBuilder } = require('discord.js');
const { color, emojis, channels } = require('../../../config');
const Guild = require('../../../lib/schemas/blacklistSchema');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			permissionLevel: PermissionLevels.BotOwner,
			description: 'Blacklist a server, restricting them from using Cadia'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('blacklist-add')
				.setDescription(this.description)
				.addStringOption((option) =>
					option.setName('server-id').setDescription('The ID of the server to be blacklist').setRequired(true)
				)
				.addStringOption((option) => option.setName('reason').setDescription('Reason for blacklisting'))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction, client) {
		try {
			const reason = interaction.options.getString('reason') || 'No reason provided';
			const guildId = interaction.options.getString('server-id');
			const targetGuild = interaction.client.guilds.cache.get(guildId);

			const logChannelId = channels.blacklistLogging;
			const logChannel = interaction.client.channels.cache.get(logChannelId);

			if (Number.isNaN(guildId)) {
				return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You have **entered** an character that is **not** a number`)], ephemeral: true });
			}

			const existingGuild = await Guild.findOne({ guildId: targetGuild.id });

			if (existingGuild !== null) {
				return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} This server has **already** been **found** in the database!`)], ephemeral: true });
			}

			if (!targetGuild) {
				await Guild.create({ guildName: 'No name found in the database', guildId: guildId, reason: `${reason}, Bot not in guild` });

				const logEmbed1 = new EmbedBuilder()
				.setColor(`${color.random}`)
				.setDescription(`${emojis.custom.ban} The server has been **blacklisted**`)
					.addFields(
						{
							name: `${emojis.custom.settings} \`-\` **Server Name:**`,
							value: `${emojis.custom.replyend} **The server name could not be found in the database**`,
							inline: false
						},
						{
							name: `${emojis.custom.pencil} \`-\` **Server ID:**`,
							value: `${emojis.custom.replyend} **${guildId}**`,
							inline: false
						},
						{
							name: `${emojis.custom.crown} \`-\` **Owner ID:**`,
							value: `${emojis.custom.replyend} **The owner ID could not be found in the database**`,
							inline: false
						},
						{
							name: `${emojis.custom.mail} \`-\` **Reason:**`,
							value: `${emojis.custom.replyend} **${reason}, Cadia is not within the server**`,
							inline: false
						},
						{
							name: `${emojis.custom.person} \`-\` **Moderator:**`,
							value: `${emojis.custom.replyend} ${interaction.user.displayName}`,
							inline: false
						}
                	)
					.setFooter({ text: `Actioned by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
					.setTimestamp();

				await logChannel.send({ embeds: [logEmbed1] });

				return interaction.reply(`${emojis.custom.warning} The server with the ID \`${guildId}\` has been **blacklisted**!\n\n${emojis.custom.mail} \`-\` **Reason:**\n${emojis.custom.replyend} **${reason}, Cadia is not within the server**`);

			}

			const embed = new EmbedBuilder()
				.setColor(color.default)
				.setDescription(`${emojis.custom.warning} Your server has been **blacklisted** from using **${interaction.client.user.displayName}**!`)
				.addFields(
					{
						name: `${emojis.custom.settings} \`-\` **Server Name:**`,
						value: `${emojis.custom.replyend} **${targetGuild.name}**`,
						inline: false
					},
					{
						name: `${emojis.custom.mail} \`-\` **Reason:**`,
						value: `${emojis.custom.replyend} **${reason}**`,
						inline: false
					},
					{
						name: `${emojis.custom.settings} \`-\` **Blacklisted By:**`,
						value: `${emojis.custom.replyend} **${interaction.user.displayName}**`,
						inline: false
					},
				)
				.setFooter({ text: `Your server has been blacklisted` })
				.setTimestamp();

			const ownerId = targetGuild.ownerId; // Get the owner ID
			const guildName = targetGuild.name;

			const logEmbed2 = new EmbedBuilder()
				.setColor(`${color.random}`)
				.setDescription(`${emojis.custom.ban} The server has been **blacklisted**`)
				.addFields(
					{
						name: `${emojis.custom.settings} \`-\` **Server Name:**`,
						value: `${emojis.custom.replyend} **${guildName}**`,
						inline: false
					},
					{
						name: `${emojis.custom.pencil} \`-\` **Server ID**`,
						value: `${emojis.custom.replyend} **${targetGuild.id}**`,
						inline: false
					},
					{
						name: `${emojis.custom.crown} \`-\` **Owner ID:**`,
						value: `${emojis.custom.replyend} ${ownerId}`,
						inline: false
					},
					{
						name: `${emojis.custom.mail} \`-\` **Reason**`,
						value: `${emojis.custom.replyend} **${reason}**`,
						inline: false
					}
				)
				.setFooter({ text: `Actioned by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
				.setTimestamp();

			await logChannel.send({ embeds: [logEmbed2] });

			await Guild.create({ guildName: targetGuild.name, guildId: targetGuild.id, reason });

			await interaction.user.send({ embeds: [embed] });

			await interaction.reply(`${emojis.custom.warning} The server with the ID \`${targetGuild.id}\` has been **blacklisted**!\n\n${emojis.custom.mail} \`-\` **Reason:**\n${emojis.custom.replyend} \`${reason}\``);
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
