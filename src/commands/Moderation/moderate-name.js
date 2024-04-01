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
			description: 'Moderate a user\'s inappropriate name'
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
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
		const userToModerate = await interaction.options.getUser('user');
		const ModerateUser = await interaction.guild.members.cache.get(userToModerate.id);
		const reason = interaction.options.getString('reason') || 'No reason provided';
		const nickname = `Moderated Name ${Math.floor(Math.random() * 9999) + 1000}`;

		// Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames))
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.forbidden} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});

		if (!ModerateUser)
			return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} The user **mentioned** is no longer **within** the **server**!`)], ephemeral: true })

		if (!ModerateUser.kickable)
			return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} I **cannot** moderate this user\'s name because they are either **higher** than me or you!`)], ephemeral: true });

		if (interaction.member.id === ModerateUser.id)
			return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** moderate your own name!`)], ephemeral: true });

		if (ModerateUser.permissions.has(PermissionsBitField.Flags.Administrator))
			return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.forbidden} You **cannot** moderate **staff members** or people with the **Administrator** permission!`)], ephemeral: true });

		try {
			ModerateUser.setNickname(nickname, reason);

			const completed = new EmbedBuilder()
                .setColor(color.default)
                .setDescription(`${emojis.custom.info} \`-\` **${userToModerate.tag}**'s name has been **moderated**!`)
                .addFields(
					{
                        name: `${emojis.custom.pencil} \`-\` **New Nickname:**`,
                        value: `${emojis.custom.replyend} **${nickname}**`,
                        inline: false
                    },
                    {
                        name: `${emojis.custom.mail} \`-\` **Reason:**`,
                        value: `${emojis.custom.replyend} **${reason}**`,
                        inline: false
                    },
                    {
                        name: `${emojis.custom.person} \`-\` **Moderator:**`,
                        value: `${emojis.custom.replyend} **${interaction.user.displayName}**`,
                        inline: false
                    }
                )
                .setFooter({ text: `User Moderated: ${userToModerate.id}` })
                .setTimestamp();

			return interaction.reply({ embeds: [completed], ephemeral: false });

		} catch (error) {
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(color.fail)
            	.setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
            	.setTimestamp();

        	return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
	}
}

module.exports = {
	UserCommand
};