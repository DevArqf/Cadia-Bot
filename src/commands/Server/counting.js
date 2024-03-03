const { Command, ApplicationCommandRegistry } = require('@sapphire/framework');
const { ChatInputCommandInteraction, TextChannel, EmbedBuilder, ChannelType } = require('discord.js');
const { emojis, color } = require('../../config');

class countingCommand extends Command {
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Setup the counting game for your server'
		});
	}

	/**
	 *
	 * @param {ApplicationCommandRegistry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				// Setup Subcommand
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('setup')
						.setDescription('(re)Setup the counting game for your server')
						.addChannelOption((option) =>
							option //
								.setName('channel')
								.setDescription('The channel to setup the counting game in')
								.setRequired(true)
								.addChannelTypes(ChannelType.GuildText)
						)
						.addIntegerOption((option) =>
							option //
								.setName('goal')
								.setDescription('The goal for the counting game')
								.setMaxValue(100_000)
								.setMinValue(1)
								.setRequired(true)
						)
				)
				// Add reward subcommand
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('reward')
						.setDescription('Setup a reward for the counting game')
						.addIntegerOption((option) =>
							option //
								.setName('count')
								.setDescription('The count the user must reach to get the reward')
								.setMaxValue(100_000)
								.setRequired(true)
								.setMinValue(1)
						)
						.addIntegerOption((option) =>
							option //
								.setName('amount')
								.setDescription('The amount of coins to give the user')
								.setMinValue(1)
						)
				)
		);
	}

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === 'setup') {
			const channel = interaction.options.getChannel('channel', true);
			const goal = interaction.options.getInteger('goal', true);

			if (!channel.isTextBased()) {
				await interaction.reply({ content: `${emojis.custom.fail} The channel must be a text channel`, ephemeral: true });
				return;
			}

			await this.container.db.guild.upsert({
				where: {
					id: interaction.guildId
				},
				update: {
					countChannel: channel.id,
					countGoal: goal,
					countLastUser: null,
					countLastScore: 0
				},
				create: {
					id: interaction.guildId,
					countChannel: channel.id,
					countGoal: goal,
					countLastUser: null,
					countLastScore: 0
				}
			});

			await interaction.reply({ content: `${emojis.custom.success} The counting game has been setup in ${channel}`, ephemeral: true });
		}

		if (subcommand === 'reward') {
			const count = interaction.options.getInteger('count', true);
			let amount = interaction.options.getInteger('amount') ?? 1000;

			await this.container.db.countingReward.upsert({
				where: {
					guildId: interaction.guildId,
					count: count
				},
				update: {
					amount
				},
				create: {
					guildId: interaction.guildId,
					count,
					amount
				}
			});

			const data = await this.container.db.guild.findFirst({
				where: {
					id: interaction.guildId
				}
			});

			if (data.countChannel === null) {
				await interaction.reply({ content: `${emojis.custom.fail} The counting game has not been setup yet`, ephemeral: true });
				return;
			}

			const countingChannel = interaction.guild.channels.cache.get(data.countChannel);

			if (!countingChannel || !countingChannel.isTextBased()) {
				await interaction.reply({ content: `${emojis.custom.fail} The counting game has not been setup yet`, ephemeral: true });
				return;
			}

			countingChannel.send({
				embeds: [
					new EmbedBuilder()
						.setTitle('Counting Game Reward')
						.setDescription(`The reward for reaching \`${count}\` counts has been set as \`${amount}\` coins`)
						.setColor(color.success)
				]
			});

			await interaction.reply({
				content: `${emojis.custom.success} The \`${amount}\` reward has been setup for ${count} counts`,
				ephemeral: true
			});
		}
	}
}

module.exports = {
	countingCommand
};
