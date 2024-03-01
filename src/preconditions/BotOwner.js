const { Precondition } = require('@sapphire/framework');
const { isOwner } = require('#utils/functions');
const { GuildMessage } = require('../lib/types/Discord');
const { ChatInputCommandInteraction } = require('discord.js');

/**
 * @class
 * @extends {Precondition}
 */
class UserPrecondition extends Precondition {
	/**
	 * @param {GuildMessage} message
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	messageRun(message) {
		return isOwner(message.member) ? this.ok() : this.error({ context: { silent: true } });
	}

	/**
	 * @param {ChatInputCommandInteraction<'cached'>} interaction
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	chatInputRun(interaction) {
		return isOwner(interaction.member) ? this.ok() : this.error({ context: { silent: true } });
	}

	/**
	 * @param {import('../lib/types/Discord').GuildContextMenuInteraction} interaction
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	contextMenuRun(interaction) {
		return isOwner(interaction.member) ? this.ok() : this.error({ context: { silent: true } });
	}
}

module.exports = { UserPrecondition };
