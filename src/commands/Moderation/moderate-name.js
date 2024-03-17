const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			requiredUserPermissions: ['ManageNicknames'],
			description: 'Moderate a user\'s name'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('moderate-name')
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('The user to moderate').setRequired(true))
				.addStringOption((option) => option.setName('reason').setDescription('Reason for the name moderation of the user').setRequired(false))
				.addStringOption((option) => option.setName('userid').setDescription('The ID of the user to moderate').setRequired(false))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
		const userToModerate = await interaction.options.getUser('user') || await interaction.client.users.fetch(await interaction.options.getString('userid'));
		const ModerateUser = await interaction.guild.members.fetch(userToModerate.id);
		const reason = interaction.options.getString('reason') || 'No reason provided';
		const nickname = `Moderated Name ${Math.floor(Math.random() * 9999) + 1000}`;

		// Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames))
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});
		if (!ModerateUser)
			return await interaction.reply({
				content: `${emojis.custom.fail} The user **mentioned** is no longer **within** the **server**!`,
				ephemeral: true
			});
		if (!ModerateUser.kickable)
			return await interaction.reply({
				content: `${emojis.custom.fail} I **cannot** moderate this user\'s name because they are either **higher** than me or you!`,
				ephemeral: true
			});
		if (interaction.member.id === ModerateUser.id)
			return interaction.reply({ content: `${emojis.custom.fail} You **cannot** moderate your own name!`, ephemeral: true });
		if (ModerateUser.permissions.has(PermissionsBitField.Flags.Administrator))
			return interaction.reply({
				content: `${emojis.custom.fail} You **cannot** moderate **staff members** or people with the **Administrator** permission!`,
				ephemeral: true
			});

		try {
			ModerateUser.setNickname(nickname, reason);

			const completed = new EmbedBuilder()
				.setColor(`${color.success}`)
				.setDescription(`**${userToModerate.tag}**'s name has been **moderated**! \n\n• **New Nickname:**\n ${emojis.custom.replyend} \`${nickname}\` \n\n• **Reason:**\n ${emojis.custom.replyend} \`${reason}\``)
				.setFooter({ text: `${userToModerate.id}` })
				.setTimestamp();

			return interaction.reply({ embeds: [completed], ephemeral: false });
		} catch (error) {
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
	}
}

module.exports = {
	UserCommand
};
