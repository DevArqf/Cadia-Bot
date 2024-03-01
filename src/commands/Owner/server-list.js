const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder } = require('discord.js');
const sourcebin = require('sourcebin_js');

// Array of developer IDs
const devIds = [
    '899385550585364481',
    '863508137080127518',
    '600707283097485322'
];

class BotOwner extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Shows all of the servers I am in (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('server-list')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

		// Check if the user's ID is in the devIds array
        if (!devIds.includes(interaction.user.id)) {
            return interaction.reply({
              content: `${emojis.custom.fail} You are not **authorized** to **execute** this command`,
              ephemeral: true
            });
          }
      
          let list = "";
          interaction.client.guilds.cache.forEach((guild) => {
            list += `${guild.name} (${guild.id}) | ${guild.memberCount} Members | Owner: ${guild.ownerId}\n`;
          });
      
          sourcebin
            .create([
              {
                name: `Beemo Server List - Code By Beemo`,
                content: list,
                languageId: "js",
              },
            ])
            .then((src) => {
              const embed = new EmbedBuilder()
                .setTitle("`📁` Server List")
                .setDescription(`${emojis.custom.success} The Server List has been **successfully** generated!\n[Click here to view](${src.url})`)
                .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                .setColor(`${color.success}`)
                .setTimestamp();
      
              interaction.reply({ embeds: [embed], ephemeral: true });
            });
        }
      };

module.exports = {
	BotOwner
};
