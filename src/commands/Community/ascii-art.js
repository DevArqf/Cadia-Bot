const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { emojis } = require('../../config')
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
				console.error(err)

        		const errorEmbed = new EmbedBuilder()
            		.setColor(color.fail)
            		.setDescription(`${emojis.custom.fail} **Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.**\n\n > ${emojis.custom.link} \`-\` *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
            		.setTimestamp();

        		interaction.reply({ embeds: [errorEmbed], ephemeral: true });

            } else {
                interaction.reply(`\`\`\`${rendered}\`\`\``);
            }
        });
    }
};

module.exports = {
	UserCommand
};
