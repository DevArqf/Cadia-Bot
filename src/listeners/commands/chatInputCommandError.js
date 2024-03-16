const { Listener, UserError, ChatInputCommandErrorPayload } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js')
const { emojis, channels, color } = require('../../config');

class UserEvent extends Listener {
	/**
	 * Handles the user event.
	 * @param {UserError} error - The error object.
	 * @param {ChatInputCommandErrorPayload} payload - The payload object.
	 * @returns {Promise<void>} - A promise that resolves when the event is handled.
	 */
	async run(error, payload) {
		const { context, message: content, identifier } = error;
		const { interaction, command } = payload;

		// `context: { silent: true }` should make UserError silent:
		if (Reflect.get(Object(context), 'silent')) return;

        const errorEmbed = new EmbedBuilder()
		.setColor(`${color.fail}`)
		.setTitle(`${emojis.reg.fail} • An error has been detected by ${interaction.user.displayName}`)
		.setDescription(`\`\`\`js\n${content}\n\nError is in file:\n${command.location.name}\n\nRoute: ${command.location.full}\`\`\``)
		.setTimestamp()

		await interaction.client.channels.cache.get(channels.errorLogging).send({ embeds: [errorEmbed] });

		return interaction.reply(`${emojis.custom.fail} **I have encountered an error! Please try again later.**`);

	}
}

module.exports = UserEvent;
