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
              return await sendMessage(`Error : \`${err.toString()}\``);
            });
        
            if (error) return;
            await sendMessage(`${emojis.custom.success} The avatar has been **successfully** uploaded!`);
          }
        };

module.exports = {
	UserCommand
};
