const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, REST, Routes, DataResolver } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Add an animated banner (DEV ONLY)',
			permissionLevel: PermissionLevels.BotOwner
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('bot-banner')
				.setDescription(this.description)
				.addAttachmentOption((option) => option
                    .setName('banner')
                    .setDescription('The banner you want to add')
                    .setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction, client) {
            const { TOKEN } = process.env;
            const { options } = interaction;
            const banner = options.getAttachment("banner");
        
            async function sendMessage(message) {
              const embed = new EmbedBuilder()
                .setColor(`${color.warning}`)
                .setDescription(message);
        
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            
            if (banner.contentType !== "image/gif" && banner.contentType !== "image/png")
                return await sendMessage(`${emojis.custom.warning} Please use a **GIF** or a **PNG** format for banners`);
            
            var error;

            const rest = new REST().setToken(TOKEN);
            await rest.patch(Routes.user(), {
                body: { banner: await DataResolver.resolveImage(banner.url) },
            });

            if (error) return;

            await sendMessage(`${emojis.custom.success} The banner has been **successfully** uploaded!`);
          }
        };

module.exports = {
	UserCommand
};
