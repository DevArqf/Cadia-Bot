const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const { RandomLoadingMessage } = require('../../lib/util/constants');

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
		const loadingMessage = RandomLoadingMessage[Math.floor(Math.random() * RandomLoadingMessage.length)];
		const sent = await interaction.reply({ content: `<a:bl_loading:1206433137928708146> **${loadingMessage}**`, fetchReply: true });

		const diff = sent.createdTimestamp - interaction.createdTimestamp;

		const uptime_ms = interaction.client.uptime;
		const uptime_seconds = Math.floor(((uptime_ms / 1000) % 60) + 6);
		const uptime_minutes = Math.floor((uptime_ms / (1000 * 60)) % 60);
		const uptime_hours = Math.floor((uptime_ms / (1000 * 60 * 60)) % 24);

		const embed = new EmbedBuilder()
			.setTitle(`${emojis.reg.success} Latency Fetched`)
			.setColor(`${color.success}`)
			.addFields(
				{
					name: '• Uptime:',
					value: `<:bl_Reply:1212047469014425650> <:bl_clock:1206612806560915547> \`${uptime_hours} h${uptime_hours !== 1 ? '' : ''} ${uptime_minutes} m${uptime_minutes !== 1 ? '' : ''} ${uptime_seconds} s${uptime_seconds !== 1 ? '' : ''}\``,
					inline: false
				},
				{
					name: '• Bot Latency:',
					value: `<:bl_Reply:1212047469014425650> <:bl_online:1206434279312195594> \`${Math.round(this.container.client.ws.ping)} ms\``
				},
				{
					name: '• API Latency:',
					value: `<:bl_Reply:1212047469014425650> <:bl_js:1206438112490692618> \`${diff} ms\``
				}
			)
			.setTimestamp()
			.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		return interaction.editReply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
