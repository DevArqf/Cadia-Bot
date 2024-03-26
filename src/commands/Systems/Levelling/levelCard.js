const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const canvafy = require('canvafy');
const { EmbedBuilder, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const Level = require('../../../lib/schemas/levelSchema');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Displays your current level and XP"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('level')
				.setDescription(this.description)
                .addUserOption((option) => option
                    .setName('user')
                    .setDescription('The user to get the level and XP from')
                    .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {
            let targetUser = interaction.options.getUser('user') || interaction.user;
            const existingLevel = await Level.findOne({ userId: targetUser.id });

            if (!existingLevel) {
                return interaction.reply({ content: `${emojis.custom.fail} This user does not have any level or XP`, ephemeral: true });
            }

            const backgroundUrl = "https://media.istockphoto.com/id/1334526454/vector/geometric-video-gaming-abstract-background.jpg?s=612x612&w=0&k=20&c=tTRQ0nZnvq0TkKlD6hMDqoK9JW4B5vzgUNH1af6HKnU="

            const rank = await new canvafy.Rank()
                .setAvatar(targetUser.displayAvatarURL({ format: 'png' }))
                .setUsername(targetUser.username)
                .setLevel(existingLevel.userLevel)
                .setCurrentXp(existingLevel.userXp)
                .setBackground('image', backgroundUrl)
                .setRequiredXp(100)
                .build();
                interaction.reply({ files: [rank], name: `rank-${interaction.member.id}.png` });
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
