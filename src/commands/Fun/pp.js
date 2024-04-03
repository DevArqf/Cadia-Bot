const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'This is not able to be discussed about'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('pp')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        const ppSize = Math.floor(Math.random() * 10) + 1;
        let ppMain = '8';
        for (let i = 0; i < ppSize; i++) {
            ppMain += '=';
        }

        
        const ppEmbed = new EmbedBuilder()
            .setColor(color.random)
            .setTitle(`${interaction.user.username}'s pp size :0`)
            .setDescription(`Your pp size is  ${ppMain}D`)

        await interaction.reply({ embeds: [ppEmbed] });
    }
};

module.exports = {
	UserCommand
};
