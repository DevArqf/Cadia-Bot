const { emojis, color } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');

class UserCommand extends BeemoCommand {
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Kick a member from the server',
			requiredUserPermissions: ['KickMembers']
		});
	}

	/**
	 *
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('The user to kick').setRequired(true))
				.addStringOption((option) => option.setName('reason').setDescription('Reason for kicking the user').setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
		const userToKick = interaction.options.getUser('user');
		const kickMember = await interaction.guild.members.fetch(userToKick.id);
		const reason = interaction.options.getString('reason');

		// Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});
		// }
		if (!kickMember) {
			return await interaction.reply({
				content: `${emojis.custom.fail} The user **mentioned** is no longer **within** the **server**!`,
				ephemeral: true
			});
		}
		if (!kickMember.kickable) {
			return await interaction.reply({
				content: `${emojis.custom.fail} I **cannot** kick this user because they are either **higher** than me or you!`,
				ephemeral: true
			});
		}
		if (interaction.member.id === kickMember.id) {
			return interaction.reply({ content: `${emojis.custom.fail} You cannot kick yourself!`, ephemeral: true });
		}
		if (kickMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({
				content: `${emojis.custom.fail} You **cannot** kick **staff members** or people with the **Administrator** permission!`,
				ephemeral: true
			});
		}

		// DM Message
		try {
			const dmEmbed = EmbedBuilder()
				.setColor(`${color.default}`)
				.setTitle(`\`🚫\` You have been kicked from **${interaction.guild.name}**`)
				.setDescription(`• **Kicked by:** \n${emojis.custom.replyend} **${interaction.user.displayName}** \n\n• **Reason:** \n${emojis.custom.replyend} \`${reason}\``)
				.setThumbnail({ url: interaction.guild.iconURL() })
				.setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
				.setTimestamp();

			await userToKick.send({ embeds: [dmEmbed] }).catch((error) => console.error(`I couldn\`t send a DM to ${userToKick.tag}.`, error));

			// Kick Successful
			const kickConfirmationEmbed = EmbedBuilder()
				.setColor(`${color.success}`)
				.setTitle(`${emojis.reg.success} Kick Successful`)
				.setDescription(`**${userToKick.tag}** has been **Kicked**! \n\n**• Reason**\n ${emojis.custom.replyend} \`${reason}\``)
				.setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
				.setTimestamp();

			// Kick Failed
			await interaction.guild.members.kick(userToKick, { reason: `**Kicked** by ${interaction.user.tag}: ${reason}` });
			await interaction.reply({ content: '', embeds: [kickConfirmationEmbed] });
		} catch (error) {
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} Kick Command Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();
		}
	}
}

module.exports = {
	UserCommand
};
