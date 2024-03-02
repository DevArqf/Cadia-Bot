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
			description: 'Unlock a channel for a specific role'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('unlock')
				.setDescription(this.description)
				.setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
				.addChannelOption((option) =>
					option.setName('channel').setDescription('The channel you want to unlock').addChannelTypes(ChannelType.GuildText).setRequired(true)
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
		// Retrieving channel and role from interaction options
		const channel = interaction.options.getChannel('channel');
		const role = interaction.options.getRole('role');

		// Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});

		// Setting permission overwrites to allow sending messages
		channel.permissionOverwrites.create(role.id, { SendMessages: true });

		// Success Embed construction
		const embed = new EmbedBuilder()
			.setTitle('`🔒` Channel Unlocked')
			.setDescription(`${emojis.custom.success} ${channel} has been **unlocked**.`)
			.addFields(
				{
					name: '`🔒` Unlocked for Role:',
					value: `
        <:bl_Reply:1212047469014425650> ${role}`,
					inline: false
				},
				{
					name: '<:bl_clock:1206612806560915547> Time:',
					value: `
        <:bl_Reply:1212047469014425650> <t:${new Date()}:f>`,
					inline: false
				},
				{
					name: '`🔒` Unlocked by:',
					value: `
        <:bl_Reply:1212047469014425650> <@${interaction.user.id}>`,
					inline: false
				}
			)
			.setColor(`${color.default}`)
			.setTimestamp()
			.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		// Replying with the success embed
		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
