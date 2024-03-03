const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Get a random meme to make you giggle"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('meme')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {
			const response = await axios.get('https://www.reddit.com/r/memes/random.json');

			if (response.data && response.data[0] && response.data[0].data.children[0].data) {
				const memeData = response.data[0].data.children[0].data;
				const { url, title, ups, num_comments } = memeData;

				const embed = new EmbedBuilder()
					.setColor(`${color.default}`)
					.setTitle(title)
					.setURL(`https://www.reddit.com${memeData.permalink}`)
					.setImage(url)
					.setTimestamp()
					.setFooter({ text: `${interaction.user.displayName} • 👍 ${ups}  |  💬 ${num_comments || 0}`, iconURL: interaction.user.displayAvatarURL() });

				await interaction.reply({ embeds: [embed] });
			} else {
				await interaction.reply(`${emojis.custom.fail} Failed to fetch a meme. Try again later.`);
			}
		} catch (error) {
			await interaction.reply(`${emojis.custom.fail} I have **encountered** an **error**:\n \`\`\`js\n${error}\`\`\``);
		}
	}
};

module.exports = {
	UserCommand
};
