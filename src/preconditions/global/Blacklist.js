const { Precondition } = require('@sapphire/framework');
const { ChatInputCommandInteraction } = require('discord.js');
const { envParseArray } = require('@skyra/env-utilities');
const { GuildMessage } = require('../../lib/types/Discord');
const Guild = require('../../lib/schemas/blacklist');

/**
 * @class
 * @extends {Precondition}
 */
class BlacklistPrecondition extends Precondition {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'Blacklist',
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
    async isNotBlacklisted(guildId) {
        const find = await Guild.findOne({ guildId: guildId });
		if (find === null) {
			return true;
		} else {
			return false;
		};
    }
}

module.exports = { BlacklistPrecondition };