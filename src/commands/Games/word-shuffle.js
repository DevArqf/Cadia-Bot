const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Guess the shuffled words Game!'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('word-shuffle')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const words = [
			'discord',
			'object',
			'sailboat',
			'blandishment',
			'beemo',
			'apple',
			'banana',
			'carrot',
			'dog',
			'elephant',
			'flower',
			'guitar',
			'house',
			'ice cream',
			'jacket',
			'kite',
			'lion',
			'monkey',
			'notebook',
			'orange',
			'penguin',
			'queen',
			'rabbit',
			'sun',
			'tree',
			'umbrella',
			'violin',
			'watermelon',
			'xylophone',
			'yacht',
			'zebra'
		];

		const selectedWord = words[Math.floor(Math.random() * words.length)];
		const shuffledWord = shuffleWord(selectedWord);

		const startEmbed = new EmbedBuilder()
			.setColor(`${color.default}`)
			.setTitle('`🔠` Word Shuffle Game')
			.setDescription(
				`**Guess the word!**\n\nThe Shuffled Word: \`${shuffledWord}\`\n\n*You have **30 seconds** to guess! Type your guess in the chat.*`
			)
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		await interaction.reply({ embeds: [startEmbed] });

		const filter = (m) => m.author.id === interaction.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

		collector.on('collect', async (m) => {
			let resultEmbed = new EmbedBuilder();

			if (m.content.toLowerCase().trim() === selectedWord) {
				resultEmbed
					.setColor(`${color.success}`)
					.setTitle(`${emojis.custom.tada} **Congratulations**, that was the **correct** answer!`)
					.setDescription(`You guessed the word **correctly**!\n\nThe word was: \`${selectedWord}\``)
					.setTimestamp()
					.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
			} else {
				resultEmbed
					.setColor(`${color.fail}`)
					.setTitle(`${emojis.reg.fail} Incorrect Answer`)
					.setDescription(`**Unfortunately**, that's the **incorrect** word!\n\nThe **correct** word was:\n ${emojis.custom.replyend} \`${selectedWord}\``)
					.setTimestamp()
					.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
			}

			await interaction.followUp({ embeds: [resultEmbed] });
		});

		collector.on('end', (collected) => {
			if (collected.size === 0) {
				const timeoutEmbed = new EmbedBuilder()
					.setColor(`${color.fail}`)
					.setTitle('`⏰` Times Up!')
					.setDescription('You ran out of time! Better luck next time!')
					.setTimestamp()
					.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
				interaction.followUp({ embeds: [timeoutEmbed] });
			}
		});
	}
}

function shuffleWord(word) {
	const shuffled = word
		.split('')
		.sort(() => 0.5 - Math.random())
		.join('');
	return shuffled;
}

module.exports = {
	UserCommand
};
