const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config')


class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Get a users avatar'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('avatar')
				.setDescription(this.description)
				.addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user to get the avatar of')
                        .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
        const user = interaction.options.getUser('user') || interaction.user;            
        const userID = await interaction.guild.members.fetch(user.id);

        const avatarURL = userID.displayAvatarURL();

        const embed = new EmbedBuilder()
        .setColor(`${color.default}`)
        .setTitle(`${emojis.reg.success} User's Profile Fetched`)
        .setDescription(`${user}\'s Profile Picture`)
        .setImage(`${avatarURL}`)
        .setTimestamp()
        .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};

module.exports = {
	UserCommand
};