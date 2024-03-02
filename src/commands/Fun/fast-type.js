const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { CommandInteraction, EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Starts a fast-type challenge'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('fast-type')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const sentences = [
			'Rex Quinfrey, a renowned scientist, created plans for an invisibility machine.',
			'Do you know why all those chemicals are so hazardous to the environment?',
			'Trixie and Veronica, our two cats, just love to play with their pink ball of yarn.',
			'We climbed to the top of the mountain in just under two hours; isn’t that great?',
			'In order to keep up at that pace, Zack Squeve would have to work all night.',
			"Beemo is my best friend. He's always there when I need him.",
			'Beemo was made on Jan, 26th, 2024 by Malik and Navin.S'
		];
		const selectedSentence = sentences[Math.floor(Math.random() * sentences.length)];

		const challengeEmbed = new EmbedBuilder()
			.setColor(`${color.default}`)
			.setTitle('`🌟` Fast-Type Challenge!')
			.setDescription('`⚡` **Are you ready to showcase your typing speed?**')
			.addFields({
				name: '`📜` Your Challenge:',
				value: `> *"${selectedSentence}"*`
			})
			.setFooter({
				text: 'You have 15 seconds. Ready... Set... Go!',
				iconURL: interaction.user.displayAvatarURL()
			})
			.setTimestamp();

		await interaction.reply({ embeds: [challengeEmbed] });

		const timeLimit = 15000; // 15 seconds

		const filter = (m) => m.author.id === interaction.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, time: timeLimit });

		collector.on('collect', (m) => {
			if (m.content.toLowerCase() === selectedSentence.toLowerCase()) {
				const timeTaken = m.createdTimestamp - interaction.createdTimestamp;
				const successEmbed = new EmbedBuilder()
					.setColor(`${color.success}`)
					.setTitle(`${emojis.custom.tada} Congratulations, You Won!`)
					.setDescription(`${m.author}, you completed the challenge in **${timeTaken / 1000}s**!`)
					.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
					.setTimestamp();

				interaction.editReply({ embeds: [successEmbed] });
				collector.stop();
			}
		});

		collector.on('end', (collected) => {
			if (collected.size === 0) {
				const failEmbed = new EmbedBuilder()
					.setColor(`${color.fail}`)
					.setTitle('`⏰` Times Up!')
					.setDescription('You ran out of time! Better luck next time!')
					.setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
					.setTimestamp();

				interaction.editReply({ embeds: [failEmbed] });
			}
		});
	}
}

module.exports = {
	UserCommand
};
