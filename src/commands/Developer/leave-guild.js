const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			permissionLevel: PermissionLevels.BotOwner,
			description: 'Forces Cadia to leave an server using a Guild ID (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('guild-leave')
				.setDescription(this.description)
                .addStringOption(option =>
                    option.setName("guildid")
                        .setDescription("provide the guild ID")
                        .setRequired(true)
                  ),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        const guildid = interaction.options.getString("guildid");
        const guild = interaction.client.guilds.cache.get(guildid)
                      
        interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} Cadia has **left** the guild mentioned below:\n\n ${emojis.custom.crown} \`-\` **Guild Name:**\n ${emojis.custom.replyend} ${guild.name}\n\n ${emojis.custom.pencil} \`-\` **Guild ID:**\n ${emojis.custom.replyend} ${guild.id}`)], ephemeral: true });

        guild.leave().catch(() => {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.fail}`).setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)], ephemeral: true });
        });

    }
};

module.exports = {
	UserCommand
};
