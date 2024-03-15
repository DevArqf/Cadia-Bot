const { seconds } = require('./lib/util/common/time');
const { PrivilegedUsers } = require('./lib/util/constants');

const { LogLevel, BucketScope } = require('@sapphire/framework');

const { GatewayIntentBits, Partials } = require('discord.js');

/**
 * @type {Config}
 */
const config = {
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping
	],
	cooldown_options: {
		delay: seconds(5),
		filteredUsers: PrivilegedUsers,
		scope: BucketScope.User
	},
	mentions: {
		parse: ['users'],
		repliedUser: false
	},
	partials: [Partials.GuildMember, Partials.Message, Partials.User, Partials.Channel],
	logger: {
		level: LogLevel.Info
	},
	api: {
		port: 4050
	}
};

/**
 * @type {import('discord.js').ClientOptions}
 */
const ClientConfig = {
	intents: config.intents,
	defaultPrefix: config.default_prefix,
	allowedMentions: config.mentions,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultCooldown: config.cooldown_options,
	partials: config.partials,
	logger: config.logger,
	loadMessageCommandListeners: true,
	typing: false,
	disableMentionPrefix: false,
	preventFailedToFetchLogForGuilds: true,
	api: config.api
};

const emojis = {
	reg: {
		success: '`✅`',
		warning: '`⚠️`',
		fail: '`❌`'
	},
	custom: {
		success: '<:bl_check_mark:1206436519498354738>',
		fail: '<:bl_x_mark:1206436599794241576>',
		warning: '<:bl_warning:1206435135701123073>',
		replystart: '<:bl_Reply_start:1212047774204301372>',
		replycontinue: '<:bl_Reply_continue:1212047673188679720>',
		replyend: '<:bl_Reply_end:1212047469014425650>',
		clock: '<:bl_clock:1206612806560915547>',
		online: '<:bl_online:1206434279312195594>',
		js: '<:bl_js:1206438112490692618>',
		tada: '<:bl_tada:1207462996859682918>',
		loading: '<a:bl_loading:1206433137928708146>',
		right: '<:bl_right:1213888472813674546>',
		left: '<:bl_left:1213888437132730368>',
		update: '<:bl_Update:1206442846907793418>'
	}
};

const color = {
	default: '#50a090',
	success: '#3bb143',
	fail: '#ff2626',
	warning: '#e9d502',
	invis: '#2b2d31',
	random: 'Random'
};

const channels = {
	commandLogging: '1214165393615364176',
	errorLogging: '1206107929372135454',
	blacklistLogging: '1208553649337405440'
};

module.exports = { ClientConfig, color, emojis, channels };

/**
 * @typedef {Object} Config
 * @property {GatewayIntentBits[]} intents
 * @property {import('@sapphire/framework').CooldownOptions} cooldown_options
 * @property {import('discord.js').MessageMentionOptions} mentions
 * @property {Partials[]} partials
 * @property {import('@sapphire/framework').ClientLoggerOptions} logger
 * @property {import('discord.js').PresenceData} presence
 * @property {import('@sapphire/framework').SapphirePrefix} default_prefix
 * @property {ScheduledTaskHandlerOptions} tasks
 * @property {import('@sapphire/plugin-api').ServerOptions} api
 */
