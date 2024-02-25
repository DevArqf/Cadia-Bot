const { Precondition } = require('@sapphire/framework');
const BeemoCommand = require('../lib/structures/commands/BeemoCommand');

class AdministratorPrecondition extends Precondition {
	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		interaction.member.permissions.has('Administrator')
			? this.ok()
			: this.error({ message: 'Only admins are allowed to run this command', identifier: 'PermissionError' });
	}

	/**
	 * @param {BeemoCommand.ContextMenuCommandInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		interaction.member.permissions.has('Administrator')
			? this.ok()
			: this.error({ message: 'Only admins are allowed to run this command', identifier: 'PermissionError' });
	}
}

module.exports = {
	AdministratorPrecondition
};
