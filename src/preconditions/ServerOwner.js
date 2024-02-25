const { Precondition } = require('@sapphire/framework');
const BeemoCommand = require('../lib/structures/commands/BeemoCommand');

class ServerOwnerPrecondition extends Precondition {
	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		interaction.guild.ownerId === interaction.member.id
			? this.ok()
			: this.error({ message: 'Only the server owner is allowed to run this command', identifier: 'PermissionError' });
	}

	/**
	 * @param {BeemoCommand.ContextMenuCommandInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		interaction.guild.ownerId === interaction.member.id
			? this.ok()
			: this.error({ message: 'Only the server owner is allowed to run this command', identifier: 'PermissionError' });
	}
}

module.exports = {
	ServerOwnerPrecondition
};
