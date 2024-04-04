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
			description: 'Add an animated avatar (DEV ONLY)',
			permissionLevel: PermissionLevels.BotOwner
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('bot-avatar')
				.setDescription(this.description)
				.addAttachmentOption((option) => option
                    .setName('avatar')
                    .setDescription('The avatar you want to add')
                    .setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
            const { options } = interaction;
            const avatar = options.getAttachment("avatar");
        
            async function sendMessage(message) {
              const embed = new EmbedBuilder()
                .setColor(color.success)
                .setDescription(message);
        
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            var error;
            await interaction.client.user.setAvatar(avatar.url).catch(async (err) => {
              error = true;
              console.log(err);
              const errorEmbed = new EmbedBuilder()
                    .setColor(color.fail)
                    .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                return;
            });
        
            if (error) return;
            await sendMessage(`${emojis.custom.success} The avatar has been **successfully** uploaded!`);
          }
        };

module.exports = {
	UserCommand
};
