const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Generate a husbando Image'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('husbando')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

        const res = await fetch('https://nekos.best/api/v2/husbando');
        const img = (await res.json()).results[0].url;
		
        const embed = new EmbedBuilder()
            .setColor(color.random)
            .setTitle(`${interaction.user.username}'s Husbando!`)
            .setImage(img)
            .setFooter({ text: `Husbando Generated by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    
        const message = await interaction.fetchReply();

        await message.react('👍');
        await message.react('👎');
    }
};

module.exports = {
	UserCommand
};
