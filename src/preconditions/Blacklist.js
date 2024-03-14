const { AllFlowsPrecondition, Result } = require('@sapphire/framework');
const Guild = require('../lib/schemas/blacklist');
const { ChatInputCommandInteraction, Message } = require('discord.js');
const { Developers } = require('../lib/util/constants');

class UserPrecondition extends AllFlowsPrecondition {
	#message = "Sorry but your server is banned from using this bot's commands. Contact the bot developer for more information.";

	constructor(context, options) {
		super(context, {
			...options,
			position: 20
		});
	}

	chatInputRun(interaction) {
		if (!interaction.guildId) return this.ok();
		return this.doBanlistCheck(interaction);
	}

	contextMenuRun(interaction) {
		if (!interaction.guildId) return this.ok();
		return this.doBanlistCheck(interaction);
	}

	messageRun(message) {
		if (!message.guildId) return this.ok();
		return this.doBanlistCheck(message);
	}

	/**
	 * @param {import('../lib/types/Discord').GuildInteraction | Message | import('../lib/types/Discord').GuildContextMenuInteraction} iom
	 * @returns
	 */
	async doBanlistCheck(iom) {
		if (Developers.includes(iom.member.id)) return this.ok(); // Should ignore commands by bot devs

		const guildId = iom.guildId;
		if (guildId === null) return this.ok();

		const find = await Guild.findOne({ guildId: guildId });

		let banned = find ? true : false;

		if (!banned) return this.ok();

		// Guild was found, therefore it is banned.
		return this.error({ identifier: 'GuildBlacklisted', message: this.#message });
	}
}
module.exports = {
	UserPrecondition
};
