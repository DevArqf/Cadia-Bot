const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config');;

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
		const unmuteMember = await interaction.guild.members.cache.get(userToUnmute.id);
		const reason = interaction.options.getString('reason') || 'No reason provided';

		// Error Prvention
		if (!unmuteMember) {
			return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} The user **mentioned** is no longer within the **server**!`)], ephemeral: true });
		}

		if (interaction.member.id === unmuteMember.id) {
			return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** unmute yourself!`)], ephemeral: true });
		}

		if (unmuteMember.permissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.forbidden} You **cannot** mute **staff members** or people with the **Administrator** permission!`)], ephemeral: true });
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
			.setColor(color.default)
			.setDescription(`${emojis.custom.info} \`-\` **${userToUnmute.tag}** has been **unmuted**!`)
			.addFields(
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
			.setFooter({ text: `User Unmuted: ${userToUnmute.id}` })
			.setTimestamp();

		return interaction.reply({ embeds: [unmuteConfirmationEmbed], ephemeral: false });
	} catch (error) {
		console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(color.fail)
            .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
            .setTimestamp();

        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		return;
	}
}

module.exports = {
	UserCommand
};