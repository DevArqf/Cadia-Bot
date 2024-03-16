const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Enlarge any emoji and save it :)"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('enlarge')
				.setDescription(this.description)
                .addStringOption((option) => option
                    .setName('emoji')
                    .setDescription('The emoji you would like to enlarge')
                    .setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		
        let emoji = interaction.options.getString('emoji')?.trim();

        if (emoji.startsWith("<") && emoji.endsWith(">")) {
            
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
            .then(image => {
                if (image) return "gif"
                else return "png"
            }).catch(err => {
                return "png"
            })

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }

        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: `${emojis.custom.fail} You **cannot** enlarge default emojis!`, ephemeral: true })
        }

        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: `${emojis.custom.fail} You **cannot** enlarge default emojis!`, ephemeral: true })
        }

        const embed = new EmbedBuilder()
        .setColor(`${color.random}`)
        .setDescription(`${emojis.custom.success} Your emoji has been **successfully** enlarged`)
        .setImage(emoji)
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}

module.exports = {
	UserCommand
};