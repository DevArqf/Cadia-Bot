const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { emojis, color } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'The credits that the Developers and Teams deserve!'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('credits')
				.setDescription(this.description)
		        );
	        }

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const embed = new EmbedBuilder()
        .setDescription(`${emojis.custom.heart2} A **HUGE** thanks to all the people who assisted with the development of Cadia!`)
        .addFields(
            {name: "navin5023", value: "> Assisting with **30%** of Cadia's **overall** making.", inline: true},
            {name: "theoreotm", value: "> Assisting with the choice of framework and **30%** of Cadia's **overall** making.", inline: false},
			{name: "Toowake Development's Team", value: "> Assisting and Provided with some of Cadia's existing commands", inline: false}
        )
        .setColor(`${color.default}`)
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
        
        await interaction.reply(
            {
                embeds: [embed]
            }
        )
    }
};

module.exports = {
	UserCommand
};
