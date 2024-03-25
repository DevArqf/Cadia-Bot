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
            requiredUserPermissions: ['Administrator'],
			description: "Setup the Levelling System for your server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('level-setup')
				.setDescription(this.description)
                .addChannelOption((option) => option
                    .setName('channel')
                    .setDescription('The channel where level messages will be sent to')
                    .setRequired(true))
                .addBooleanOption((option) => option
                    .setName('embed')
                    .setDescription('Whether to send level-up messages as embeds')
                    .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {
            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guild.id;
            const channelId = channel.id;
            const useEmbed = interaction.options.getBoolean('embed') || false;

            // Permissions
		    // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
		    // 	return await interaction.reply({
		    // 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		    // 		ephemeral: true
		    // 	});

            const existingLevel = await Level.findOne({ guildId });

            if (existingLevel) {
                return await interaction.reply({ content: `${emojis.custom.fail} The level system has **already** been setup!`, epehemeral: ture });
            }
            
            const defaultMessage = `${emojis.custom.tada} **Congratulations** <@${userId}>! You have **leveled up** to level **${userLevel}**!`;

            await Level.create({
                guildId,
                channelId,
                messages: [{ content: defaultMessage }],
                useEmbed: true,
            });
            await interaction.reply(`${emojis.custom.success} The level system has been **successfully** set up!`);
        } catch (error) {
            console.error(error)
            const errorEmbed = new EmbedBuilder()
				.setColor(`${color.fail}`)
				.setTitle(`${emojis.custom.fail} Level Setup Error`)
				.setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**\n\n *Have you already tried and you are still encountering this error, please join our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bug-report:1219050295770742934>*`)
				.setTimestamp();

			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
        }
	}
}

module.exports = {
	UserCommand
};
