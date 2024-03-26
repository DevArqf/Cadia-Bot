const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Level = require('../../../lib/schemas/levelSchema');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Disable the levelling system within the server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('level-disable')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});

        try {
            const guildId = interaction.guild.id;
            const existingLevel = await Level.findOne({ guildId });

            if (!existingLevel) {
                return await interaction.reply({ content: `${emojis.custom.fail} The level system has **not** been setup. The is **nothing** to disable!`, ephemeral: true });
            }

            await Level.findOneAndDelete({ guildId });
            await interaction.reply(`${emojis.custom.success} The **level system** has been successfully **disabled**`);
        } catch (error) {
            console.error(error)
            const errorEmbed = new EmbedBuilder()
				.setColor(`${color.fail}`)
				.setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**\n\n > *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
				.setTimestamp();

			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
        }
	}
}

module.exports = {
	UserCommand
};
