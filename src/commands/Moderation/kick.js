const { emojis, color } = require('../../config');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');

class UserCommand extends BeemoCommand {
	constructor(context, options) {
		super(context, {
			...options,
			requiredUserPermissions: ['KickMembers'],
			description: 'Kick a member from the server',
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
				.addStringOption((option) => option.setName('reason').setDescription('Reason for kicking the user').setRequired(false))
				.addStringOption((option) => option.setName('userid').setDescription('The ID of the user to kick').setRequired(false))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
		const userToKick = interaction.options.getUser('user') || await interaction.client.users.fetch(await interaction.options.getString('userid'));
		const kickMember = await interaction.guild.members.fetch(userToKick.id);
		const reason = interaction.options.getString('reason') || 'No reason provided';

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
			return interaction.reply({ content: `${emojis.custom.fail} You **cannot** kick yourself!`, ephemeral: true });
		}
		if (kickMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({
				content: `${emojis.custom.fail} You **cannot** kick **staff members** or people with the **Administrator** permission!`,
				ephemeral: true
			});
		}

		// DM Message
		try {
			const dmEmbed = new EmbedBuilder()
				.setColor(`${color.default}`)
				.setTitle(`\`🚫\` You have been kicked from **${interaction.guild.name}**`)
				.setDescription(`• **Kicked by:** \n${emojis.custom.replyend} \`${interaction.user.tag}\` \n\n• **Reason:** \n${emojis.custom.replyend} \`${reason}\``)
				.setFooter({ text: `${userToKick.id}` })
				.setTimestamp();

			await userToKick.send({ embeds: [dmEmbed] }).catch((error) => console.error(`I **cannot** send a Direct Message to ${userToKick.tag}.`, error));

			// Kick Successful
			const kickConfirmationEmbed = new EmbedBuilder()
				.setColor(`${color.success}`)
				.setDescription(`**${userToKick.tag}** has been successfully **Kicked**! \n\n**• Reason**\n ${emojis.custom.replyend} \`${reason}\``)
				.setFooter({ text: `${userToKick.id}` })
				.setTimestamp();

			// Kick Failed
			await interaction.guild.members.kick(userToKick, { reason: `${userToKick.id}: ${reason}` });
			await interaction.reply({ content: '', embeds: [kickConfirmationEmbed] });
		} catch (error) {
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**`)
            	.setTimestamp();
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });	
		}
	}
}

module.exports = {
	UserCommand
};
