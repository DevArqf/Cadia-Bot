const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'ping pong !'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('ping')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const msg = await interaction.reply('Ping');

		const now = Date.now();

		const content = `Pong from Beemo! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${now - msg.createdTimestamp}ms.`;

		return interaction.editReply(content);
	}
}

module.exports = {
	UserCommand
};
