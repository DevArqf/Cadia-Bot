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

		if (!unmuteMember) {
			return await interaction.reply({
				content: `${emojis.custom.fail} The user **mentioned** is no longer within the **server**!`,
				ephemeral: true
			});
		}
		if (interaction.member.id === unmuteMember.id) {
			return interaction.reply({ content: `${emojis.custom.fail} You **cannot** unmute yourself!`, ephemeral: true });
		}
		if (unmuteMember.permissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				content: `${emojis.custom.fail} You **cannot** mute **staff members** or people with the **Administrator** permission!`,
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
			.setDescription(`**${userToUnmute.tag}** has been **Unmuted**! \n\n**• Reason:**\n ${emojis.custom.replyend} \`${reason}\``)
			.setTimestamp()
			.setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		return interaction.reply({ embeds: [unmuteConfirmationEmbed], ephemeral: false });
	} catch (error) {
		console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`${emojis.custom.fail} Unmute Command Error`)
            .setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            .setTimestamp();

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		return;
	}
}

module.exports = {
	UserCommand
};
