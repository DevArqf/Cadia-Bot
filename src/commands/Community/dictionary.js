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
			description: "Search a word in the dictionary"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('dictionary')
				.setDescription(this.description)
                .addStringOption(option => option
                    .setName('word')
                    .setDescription('The word you want to search')
                    .setRequired(true)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
            const word = interaction.options.getString('word');
     
            let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
     
            if (data.statusText == 'Not Found') {
                return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} That word does **not** exist!`)], ephemeral: true});
            }
     
            let info = await data.json();
            let result = info[0];
     
          let embedInfo = await result.meanings.map((data, index) => {
     
                let definition = data.definitions[0].definition || "No definition found";
                let example = data.definitions[0].example || "No example found";
     
     
                return {
                    name: data.partOfSpeech.toUpperCase(),
                    value: `\`\`\` Description: ${definition} \n Example: ${example} \`\`\``,
                };
     
     
            });
     
            const embed = new EmbedBuilder()
            .setColor(color.default)
            .setTitle(`${emojis.custom.right} Definition of "**${result.word}**"`)
            .addFields(embedInfo)
     
            await interaction.reply({ embeds: [embed] });
        }
    };

module.exports = {
	UserCommand
};
