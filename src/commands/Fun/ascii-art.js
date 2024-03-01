const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { emojis } = require('../../config')
const { EmbedBuilder } = require('discord.js');
const ascii = require('ascii-art');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Create beautiful Ascii Arts'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('ascii')
				.setDescription(this.description)
                .addStringOption(option => option
                    .setName("text")
                    .setDescription("The text")
                    .setRequired(true))
		        );
	        }

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const text = interaction.options.getString("text");

        ascii.font(text, 'Doom', (err, rendered) => {
            if (err) {
                interaction.reply(`${emojis.custom.fail} I have **encountered** an **error**:\n \`\`\`js\n${err}\`\`\``);
            } else {
                interaction.reply(`\`\`\`${rendered}\`\`\``);
            }
        });
    }
};

module.exports = {
	UserCommand
};
