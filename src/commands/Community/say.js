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
            requiredUserPermissions: ['ManageMessages'],
			description: "Say something as your bot!"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
            .setName('say')
            .setDescription(this.description)
            .setDMPermission(false)
            .addStringOption(option => option
                .setName('text')
                .setDescription('Specified text will be your message')
                .setRequired(true)
                .setMinLength(1)
                .setMaxLength(2000))
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('Specified channel will receive your message')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        try {
        // Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: `You cannot do that!`, ephemeral: true });
        // else {

            const channel = await interaction.options.getChannel('channel') || interaction.channel;
            const message = await interaction.options.getString('text');
            await channel.send({ content: message});
            await interaction.reply({ content: `${emojis.custom.success} Your message ${message} has been **successfully** sent in ${channel}`, ephemeral: true });

        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor(`${color.fail}`)
                .setTitle(`${emojis.custom.fail} Say Command Error`)
                .setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**\n\n *Have you already tried and you are still encountering this error, please join our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bug-report:1219050295770742934>*`)
                .setTimestamp();
    
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }
    }
};

module.exports = {
	UserCommand
};
