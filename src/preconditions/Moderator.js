const { Precondition } = require('@sapphire/framework');
const BeemoCommand = require('../lib/structures/commands/BeemoCommand');

class ModeratorPrecondition extends Precondition {
	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		interaction.member.permissions.has('ManageGuild')
			? this.ok()
			: this.error({ message: 'Only moderators are allowed to run this command', identifier: 'PermissionError' });
	}

	/**
	 * @param {BeemoCommand.ContextMenuCommandInteraction} interaction
	 */
	async contextMenuRun(interaction) {
		interaction.member.permissions.has('ManageGuild')
			? this.ok()
			: this.error({ message: 'Only moderators are allowed to run this command', identifier: 'PermissionError' });
	}
}

module.exports = {
	ModeratorPrecondition
};
