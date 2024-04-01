const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const { RandomLoadingMessage } = require('../../lib/util/constants');
const { ReleaseNotesSchema } = require('../../lib/schemas/releasenoteSchema');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Get the Bot's and API's Latency"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('ping')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {

		// const loadingMessage = RandomLoadingMessage[Math.floor(Math.random() * RandomLoadingMessage.length)];
		const sent = await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.loading} | **Currently fetching the latency, this might take a while**`)], fetchReply: true });
		const latestRelease = await ReleaseNotesSchema.findOne({}, {}, { sort: { 'createdAt' : -1 } });
		const version = latestRelease ? latestRelease.Version : 'Not available';
		const diff = sent.createdTimestamp - interaction.createdTimestamp;

		const uptime_ms = interaction.client.uptime;
		const uptime_seconds = Math.floor(((uptime_ms / 1000) % 60) + 6);
		const uptime_minutes = Math.floor((uptime_ms / (1000 * 60)) % 60);
		const uptime_hours = Math.floor((uptime_ms / (1000 * 60 * 60)) % 24);

		const embed = new EmbedBuilder()
			.setColor(`${color.invis}`)
			.setDescription(`> \`🏓\` **Here are some useful information about Cadia!**`)
			.addFields(
				{
					name: `${emojis.custom.developer} \`-\` Status`,
					value: `\`\`\`🟢 Online\`\`\``,
					inline: true
				},
				{
					name: `${emojis.custom.settings} \`-\` Database`,
					value: `\`\`\`🟢 Connected\`\`\``,
					inline: true
				},
				{
					name: `${emojis.custom.clock} \`-\` Uptime`,
					value: `\`\`\`${uptime_hours} h${uptime_hours !== 1 ? '' : ''} ${uptime_minutes} m${uptime_minutes !== 1 ? '' : ''} ${uptime_seconds} s${uptime_seconds !== 1 ? '' : ''}\`\`\``,
					inline: true
				},
				{
					name: `${emojis.custom.connected} \`-\` Bot Latency`,
					value: `\`\`\`${Math.round(this.container.client.ws.ping)} ms\`\`\``,
					inline: true
				},
				{
					name: `${emojis.custom.javascript} \`-\` API Latency`,
					value: `\`\`\`${diff} ms\`\`\``,
					inline: true
				},
				{
					name: `${emojis.custom.info} \`-\` Version`,
					value: `\`\`\`${version}\`\`\``,
					inline: true
				}
			)
			.setTimestamp()
			.setFooter({ text: `Requested By ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		return interaction.editReply({ embeds: [embed] });
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
