const { seconds } = require('./lib/util/common/time');
const { PrivilegedUsers } = require('./lib/util/constants');

const { LogLevel, BucketScope } = require('@sapphire/framework');

const { GatewayIntentBits, Partials } = require('discord.js');

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
	}
};

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
	preventFailedToFetchLogForGuilds: true
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
		reply: '<:bl_Reply:1212047469014425650>',
		clock: '<:bl_clock:1206612806560915547>',
		online: '<:bl_online:1206434279312195594>',
		js: '<:bl_js:1206438112490692618>',
		tada: '<:bl_tada:1207462996859682918>',
		loading: '<a:bl_loading:1206433137928708146>',
		reply_start: '<:bl_Reply_start:1212047774204301372>',
		reply: '<:bl_Reply:1212047469014425650>'
	}
};

const color = {
	default: '#50a090',
	success: '#3bb143',
	fail: '#ff2626',
	warning: '#e9d502'
};

module.exports = { ClientConfig, color, emojis };
