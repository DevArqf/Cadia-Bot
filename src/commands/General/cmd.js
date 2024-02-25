const { PermissionLevels } = require('../../lib/types/Enums');
const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');

class NAMECommand extends BeemoCommand {
	constructor(context, options) {
		super(context, {
			...options,
			description: '__DESCRIPTION__'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		interaction.reply('hi');
	}
}

module.exports = {
	NAMECommand
};
