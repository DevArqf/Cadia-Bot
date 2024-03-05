const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Send a DM to a user within the server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('dm')
				.setDescription(this.description)
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user that should receive a DM')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('The message that the user should receive')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for the DM'))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');
        const reason = interaction.options.getString('reason');
 
        const embed = new EmbedBuilder()
            .setTitle('`📮` Direct Message Received')
            .setColor(`${color.default}`)
            .addFields(
                { name: '`📝` Message', value: `${emojis.custom.replyend} ${message}` },
                { name: '`💻` Server', value: `${emojis.custom.replyend} ${interaction.guild.name}` },
                { name: '`🔨` Reason', value: `${emojis.custom.replyend} ${reason}` || 'No reason provided' },
                { name: '`👷‍♂️` Operator', value: `${emojis.custom.replyend} ${interaction.user}` },
            )
            .setFooter({ name: `${interaction.user.displayName}`, iconURL: interaction.user.avatarURL() })
            .setTimestamp();
 
            await user.send({ embeds: [embed] })
                .then(() => {
                    interaction.reply({ content: `${emojis.custom.success} The message was **successfully** sent to **${user.tag}**!` });
                })
                .catch(() => {
                    interaction.reply({ content: `${emojis.custom.fail} **${user.tag}** has DMs **disabled**!` });
                });
	}
};

module.exports = {
	UserCommand
};
