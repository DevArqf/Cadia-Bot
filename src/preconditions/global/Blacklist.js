const { Precondition } = require('@sapphire/framework');
const { ChatInputCommandInteraction } = require('discord.js');
const { envParseArray } = require('@skyra/env-utilities');
const { GuildMessage } = require('../../lib/types/Discord');

/**
 * @class
 * @extends {Precondition}
 */
class BotOwnerPrecondition extends Precondition {
	constructor(context, options) {
		super(context, {
			...options,
			name: 'BotOwner',
			position: 1
		});
	}

	/**
	 * @param {GuildMessage} message
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	messageRun(message) {
		return this.isBlacklisted(message.guildId) ? this.ok() : this.error({ context: { silent: false }, identifier: 'PermissionError' });
	}

	/**
	 * @param {ChatInputCommandInteraction<'cached'>} interaction
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	chatInputRun(interaction) {
		return this.isBlacklisted(interaction.guildId) ? this.ok() : this.error({ context: { silent: false }, identifier: 'PermissionError' });
	}

	/**
	 * @param {import('../../lib/types/Discord').GuildContextMenuInteraction} interaction
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	contextMenuRun(interaction) {
		return this.isBlacklisted(interaction.guildId) ? this.ok() : this.error({ context: { silent: false }, identifier: 'PermissionError' });
	}

	/**
	 *
	 * @param {import('discord.js').Snowflake} guildId The id of the guild you want to check
	 */
	isBlacklisted(guildId) {
		return false; // TODO: Implement this
	}
}

module.exports = { BotOwnerPrecondition };
