const { emojis, color } = require('../../config');
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
		// 		content: '<:bl_x_mark:1206436599794241576> You are not **authorzied** to **execute** this command!',
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
			const dmEmbed = {
				color: `#ff5555`,
				title: `🚫 You have been kicked from **${interaction.guild.name}**`,
				thumbnail: { url: interaction.guild.iconURL() },
				fields: [
					{ name: '• **Kicked by:**', value: interaction.user.tag },
					{ name: '• **Reason:**', value: reason }
				],
				timestamp: new Date()
			};

			await userToKick.send({ embeds: [dmEmbed] }).catch((error) => console.error(`Beemo could not send DM to ${userToKick.tag}.`, error));

			// Kick Successful
			const kickConfirmationEmbed = {
				color: `${color.success}`,
				title: '`✅` Kick Successful',
				description: `**${userToKick.tag}** has been **kicked** from the server.`,
				fields: [{ name: '**Reason:**', value: reason }],
				timestamp: new Date(),
				footer: { text: `**Kicked** by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }
			};

			// Kick Failed
			await interaction.guild.members.kick(userToKick, { reason: `**Kicked** by ${interaction.user.tag}: ${reason}` });
			await interaction.reply({ content: '', embeds: [kickConfirmationEmbed] });
		} catch (error) {
			console.error(error);
			const errorEmbed = {
				color: `${color.fail}`,
				title: '`❌` Error Kicking User',
				description: `I have **Failed** to kick **${userToKick.tag}** from the server.`,
				timestamp: new Date(),
				footer: { text: 'Uh Oh... I have **encountered** an **error**', iconURL: interaction.client.user.displayAvatarURL() }
			};
			await interaction.reply({ content: '', embeds: [errorEmbed] });
		}
	}
}

module.exports = {
	UserCommand
};
