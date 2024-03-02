const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			requiredUserPermissions: ['ManageChannels'],
			description: 'Lock a channel for a specific role'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('lock')
				.setDescription(this.description)
				.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
				.addChannelOption((option) =>
					option.setName('channel').setDescription('The channel you want to lock').addChannelTypes(ChannelType.GuildText).setRequired(true)
				)
				.addRoleOption((option) =>
					option.setName('role').setDescription('The role you want to restrict from sending messages').setRequired(true)
				)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Retrieve channel and role from user's command input
		const channel = interaction.options.getChannel('channel');
		const role = interaction.options.getRole('role');

		// Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});

		// Apply permission overwrite to lock the channel for the specified role
		channel.permissionOverwrites.create(role, { SendMessages: false });

		// Create an embed to confirm channel locking and provide details
		const embed = new EmbedBuilder()
			.setTitle('`🔒` Channel Locked')
			.setDescription(`${emojis.custom.success} ${channel} has been **locked**.`)
			.addFields(
				{
					name: '`🔒` Locked for Role:',
					value: `${emojis.custom.reply} ${role}`,
					inline: false
				},
				{
					name: `${emojis.custom.clock} Time:`,
					value: `${emojis.custom.reply} <t:${new Date()}:f>`,
					inline: false
				},
				{
					name: '`🔒` Locked by:',
					value: `${emojis.custom.reply} <@${interaction.user.id}>`,
					inline: false
				}
			)
			.setColor(`${color.default}`)
			.setTimestamp()
			.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		// Send the embed as a reply to confirm the channel locking
		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
