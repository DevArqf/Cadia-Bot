const { Guild, GuildMember } = require('discord.js');

/**
 * @interface
 * @extends Message
 */
class GuildMessage {
	/**
	 * The channel where the message was sent.
	 * @type {GuildChannel}
	 * @memberof GuildMessage
	 */
	channel;

	/**
	 * The ID of the guild where the message was sent.
	 * @type {string}
	 * @memberof GuildMessage
	 * @readonly
	 */
	guildId;

	/**
	 * The guild where the message was sent.
	 * @type {Guild}
	 * @memberof GuildMessage
	 * @readonly
	 */
	guild;

	/**
	 * The member who sent the message in the guild.
	 * @type {GuildMember}
	 * @memberof GuildMessage
	 * @readonly
	 */
	member;
}

module.exports = { GuildMessage };
