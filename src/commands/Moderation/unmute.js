const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { PermissionFlagsBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			requiredUserPermissions: ['ManageRoles'],
			description: 'Unmute a user within the server, allowing them to speak again.'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('unmute')
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('The user to unmute').setRequired(true))
				.addStringOption((option) => option.setName('reason').setDescription('Reason for the unmute').setRequired(false))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
		const userToUnmute = interaction.options.getUser('user');
		const unmuteMember = await interaction.guild.members.fetch(userToUnmute.id);
		const reason = interaction.options.getString('reason') || 'No Reason Provided';

		// // Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
		// 	return await interaction.reply({
		// 		content: '<:bl_x_mark:1206436599794241576> You are not **authorized** to **execute** this command!',
		// 		ephemeral: true
		// 	});
		// }
		if (!unmuteMember) {
			return await interaction.reply({
				content: '<:bl_x_mark:1206436599794241576> The user **mentioned** is no longer within the **server**!',
				ephemeral: true
			});
		}
		if (interaction.member.id === unmuteMember.id) {
			return interaction.reply({ content: '<:bl_x_mark:1206436599794241576> You **cannot** unmute yourself!', ephemeral: true });
		}
		if (unmuteMember.permissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				content: '<:bl_x_mark:1206436599794241576> You **cannot** mute **staff members** or people with the **Administrator** permission!',
				ephemeral: true
			});
		}

		// Handle Unmute
		await handleUnmute(interaction, userToUnmute, unmuteMember, reason);
	}
}

async function handleUnmute(interaction, userToUnmute, unmuteMember, reason) {
	try {
		// Clear timeout for the user
		await unmuteMember.timeout(1000, reason);

		// Reply with confirmation
		const unmuteConfirmationEmbed = new EmbedBuilder()
			.setColor(`${color.success}`)
			.setTitle(`${emojis.reg.success} Successfully Unmuted User`)
			.setDescription(`**${userToUnmute.tag}** has been **Unmuted**! \n\n**• Reason:**\n > \`${reason}\``)
			.setTimestamp()
			.setFooter({ text: `Unmuted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		return interaction.reply({ embeds: [unmuteConfirmationEmbed], ephemeral: false });
	} catch (error) {
		console.error(error);

		const errorEmbed = new EmbedBuilder()
			.setColor(`${color.fail}`)
			.setTitle(`${emojis.reg.fail} Error Unmuting User'`)
			.setDescription('I have encountered an **error** while trying to **unmute** the user.')
			.setTimestamp()
			.setFooter({ text: 'Uh Oh... I have encountered an error', iconURL: interaction.user.displayAvatarURL() });

		return interaction.reply({ embeds: [errorEmbed] });
	}
}

module.exports = {
	UserCommand
};
