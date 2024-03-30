const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Play a game of rock, paper, scissors!'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('rps')
				.setDescription(this.description)
				.addUserOption((option) => option.setName('opponent').setDescription('The user to compete against').setRequired(true))
				.setDMPermission(false)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const player1 = interaction.user;
		const player2 = interaction.options.getUser('opponent');

		const choices = [
			{ name: 'Rock', emoji: '🪨', beats: 'Scissors' },
			{ name: 'Paper', emoji: '📄', beats: 'Rock' },
			{ name: 'Scissors', emoji: '✂️', beats: 'Paper' }
		];

		if (player1.id == player2.id) {
			await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You cannot play the game with yourself!`)], ephemeral: true });
			return;
		}
		if (player2.bot) {
			await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You cannot play the game with a bot!`)], ephemeral: true });
			return;
		}

		const gameEmbed = new EmbedBuilder()
			.setColor(color.default)
			.setTitle('`⚡` Rock, Paper, Scissors!')
			.setDescription(`It's currently ${player2}'s turn.`)

		const buttons = choices.map((choice) => {
			return new ButtonBuilder().setLabel(choice.name).setCustomId(choice.name).setEmoji(choice.emoji).setStyle(ButtonStyle.Primary);
		});

		const gameButtons = new ActionRowBuilder().addComponents(buttons);

		const game = await interaction.reply({
			content: `${player2}! You have been challenged to a game of rock, paper, scissors by ${player1}.`,
			embeds: [gameEmbed],
			components: [gameButtons]
		});

		const player2Interaction = await game
			.awaitMessageComponent({
				filter: (i) => i.user.id == player2.id,
				time: 30_000
			})
			.catch(async (error) => {
				gameEmbed.setDescription(`**Game Over!** ${player2} did not respond.`);
				await game.edit({ content: 'The game has ended!', embeds: [gameEmbed], components: [] });
			});

		if (!player2Interaction) return;

		const player2Choice = choices.find((choice) => choice.name == player2Interaction.customId);

		await player2Interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`You picked ${player2Choice.name + player2Choice.emoji}`)], ephemeral: true });
		gameEmbed.setDescription(`It's currently ${player1}'s turn.`);
		await game.edit({
			content: `${player1} it's your turn now!`,
			embeds: [gameEmbed]
		});

		const player1Interaction = await game
			.awaitMessageComponent({
				filter: (i) => i.user.id == player1.id,
				time: 30_000
			})
			.catch(async (error) => {
				gameEmbed.setDescription(`**Game Over!** ${player1} did not respond.`);
				await game.edit({ content: 'The game has ended!', embeds: [gameEmbed], components: [] });
			});

		if (!player1Interaction) return;

		const player1Choice = choices.find((choice) => choice.name == player1Interaction.customId);

		let result;

		if (player1Choice.beats == player2Choice.name) {
			result = `${emojis.custom.tada} Congratulations ${player1}, you won!`;
		}
		if (player2Choice.beats == player1Choice.name) {
			result = `${emojis.custom.tada} Congratulations ${player2}, you won!`;
		}
		if (player1Choice.name == player2Choice.name) {
			result = 'Good Game, it was a tie!';
		}

		gameEmbed.setDescription(
			`${player1} picked\n ${emojis.custom.replyend} ${player1Choice.name + player1Choice.emoji}\n ${player2} picked\n ${emojis.custom.replyend} ${player2Choice.name + player2Choice.emoji}\n\n ${result}`
		);
		game.edit({ content: 'The Game has ended!', embeds: [gameEmbed], components: [] });
	}
}

module.exports = {
	UserCommand
};
