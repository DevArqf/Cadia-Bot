const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const { EmbedBuilder } = require('discord.js');
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
			description: "Set your custom level-up message! Available variables: {userMention}, {userName}, {userLevel}"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('level-message')
				.setDescription(this.description)
                .addStringOption((option) => option
                    .setName('message')
                    .setDescription('The custom level up message. Available variables: {userMention}, {userName}, {userLevel}')
                    .setRequired(true)),
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
                return await interaction.reply({ content: `${emojis.custom.fail} The level system has **not** been setup. Please **setup** the level system **first**!`, ephemeral: true });
            }

            const userMessage = interaction.option.getString('message');

            const variables = {
                '{userMention}': `<@${interaction.user.id}>`,
                '{userName}' : interaction.user.username,
            };
            const updatedMessage = userMessage.replace(/{(.*?)}/g, (match, variable) => variables[variable] || match);

            existingLevel.messages[0].content = updatedMessage;
            await existingLevel.save();

            await interaction.reply(`${emojis.custom.success} The **custom** level up **messages** has been set **successfully**!`);
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
