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
		return this.isNotBlacklisted(message.guildId) ? this.ok() : this.error({ context: { silent: false }, identifier: 'PermissionError' });
	}

	/**
	 * @param {ChatInputCommandInteraction<'cached'>} interaction
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	chatInputRun(interaction) {
		return this.isNotBlacklisted(interaction.guildId) ? this.ok() : this.error({ context: { silent: false }, identifier: 'PermissionError' });
	}

	/**
	 * @param {import('../../lib/types/Discord').GuildContextMenuInteraction} interaction
	 * @returns {import('@sapphire/framework').PreconditionResult}
	 */
	contextMenuRun(interaction) {
		return this.isNotBlacklisted(interaction.guildId) ? this.ok() : this.error({ context: { silent: false }, identifier: 'PermissionError' });
	}

	/**
	 *
	 * @param {import('discord.js').Snowflake} guildId The id of the guild you want to check
	 */
	isNotBlacklisted(guildId) {
		return true; // TODO: Implement this
	}
}

module.exports = { BotOwnerPrecondition };
