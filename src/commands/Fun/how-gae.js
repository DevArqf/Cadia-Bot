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
			description: 'Trust me, the answer is 100% accurate. No questions asked!'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('how-gae')
				.setDescription(this.description)
                .addUserOption(option => option.setName('target').setDescription(`Target's gae percentage.`)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

        let target = interaction.options.getUser('target') || interaction.user;
        let randomizer = Math.floor(Math.random() * 101);
 
        const embed = new EmbedBuilder()
        .setColor(color.random)
        .setTitle(`How gae is ${target.username}?`)
        .setFooter({ text: `Gae Percentage`})
        .addFields({ name: `Percentage`, value: `${target} is **${randomizer}%** gae. 🍆`})
        .setTimestamp();
 
        await interaction.reply({embeds: [embed] });
 
    }
};

module.exports = {
	UserCommand
};
