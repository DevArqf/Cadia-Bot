const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { inspect } = require('util');
const beautify = require('beautify');
const { EmbedBuilder } = require('discord.js');

class BotOwner extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Evaluates Javascript Code (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('eval')
				.setDescription(this.description)
				.addStringOption((option) => 
					option.setName('code')
						.setDescription('The code to evaluate')
						.setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Get the code from the interaction options
		const code = interaction.options.getString('code');

		// Create a regular expression to filter out the bot token from the code
		const tokenfilter = new RegExp(
			`${interaction.client.token.split('').join('[^]{0,2}')}|${interaction.client.token.split('').reverse().join('[^]{0,2}')}`,
			'g'
		);

		try {
			// Evaluate the code
			let output = eval(code);
			// If the output is a promise, wait for it to resolve
			if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function'))
				output = await output;
			// Inspect the output
			output = inspect(output);
			// Replace the bot token with "no" in the output
			output = output.replace(tokenfilter, 'no');

			// Measure the time taken to execute the code
			let start, end;
			start = new Date();
			for (let i = 0; i < 1000; i++) {
				Math.sqrt(i);
			}
			end = new Date();

			// Beautify the evaluated code for display
			const evaluatedCode = beautify(code, { format: 'js' });

			// Create an embed to display the evaluated code and output
			const embed = new EmbedBuilder()
				.setColor(`${color.default}`)
				.setTitle('`🔍` Evaluated Code')
				.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
				.setDescription(
					`**• Input:**\n\`\`\`js\n${evaluatedCode}\n\`\`\`\n**• Output:**\n\`\`\`${output.replaceAll("'", '')}\`\`\`\n**Operation took** \`${end?.getTime() - start?.getTime()}\` **millisecond**${end?.getTime() - start?.getTime() > 1 ? 's' : ''}.`
				)
				.setTimestamp();

			// Check if embed size is within limits for Discord
			if (embed.length < 1800) {
				// If within limits, reply with embed
				interaction.reply({ embeds: [embed] });
			} else {
				// If exceeds limits, reply without embed
				interaction.reply({
					content: `**Operation took** \`${end?.getTime() - start?.getTime()}\` **millisecond**${end?.getTime() - start?.getTime() > 1 ? 's' : ''}.`
				});
			}

			// Create a collector for message components (buttons)
			const filter = (i) => {
				if (i.user.id === interaction.author.id) return true;
				i.reply({ content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!**`, ephemeral: true });
				return false;
			};

			const collector = await interaction.channel.createMessageComponentCollector({
				filter,
				componentType: 'BUTTON'
			});

			// Handle button click events
			collector.on('collect', async (i) => {
				i.deferUpdate();
				if (i.customId === 'delete-evaluated-output') {
					i.message.delete();
				}
			});
		} catch (error) {
			// If an error occurs, send the error message to the channel
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} Eval Command Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
		}
	}
}

module.exports = {
	BotOwner
};
