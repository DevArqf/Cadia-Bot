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

// Check the Dev Server to see the Custom Emojis //
const emojis = {
	reg: {
		success: '`✅`',
		warning: '`⚠️`',
		fail: '`❌`'
	},
	custom: {
		success: '<:cl_success:1223399655703052429>',
		fail: '<:cl_fail:1223399595430772829>',
		forbidden: '<:cl_forbidden:1223407867902689363>',
		warning1: '<:cl_warning:1223402716403994714>',
		warning2: '<:cl_warning2:1223410548666794004>',
		replystart: '<:cl_Reply_start:1212047774204301372>',
		replycontinue: '<:cl_Reply_continue:1212047673188679720>',
		replyend: '<:cl_Reply_end:1212047469014425650>',
		connected: '<:cl_connected:1223398735082553436>',
		online: '<:cl_online:1223412407343251556>',
		offline: '<:cl_offline:1223412308844347535>',
		developer: '<:cl_developer:1223413359672819764>',
		javascript: '<:cl_javascript:1223402720967393360>',
		tada: '<:cl_tada:1223405544111607999>',
		loading: '<a:cl_loading:1223413965124669470>',
		right: '<:cl_right:1213888472813674546>',
		left: '<:cl_left:1213888437132730368>',
		update: '<:cl_Update:1206442846907793418>',
		home: '<:cl_home:1223402675325108375>',
		plus: '<:cl_add:1223408560764092528>',
		slash: '<:cl_slash:1223407888697921686>',
		wave: '<a:cl_wave:1219771036862513172>',
		ban: '<:cl_ban:1223413361648336947>',
		clock: '<:cl_clock:1223411674250481705>',
		community: '<:cl_community:1223405549824114739>',
		compass: '<:cl_compass:1223409175552589844>',
		calendar: '<:cl_calendar:1223402712180330667>',
		comment: '<:cl_comment:1223405554102304839>',
		gem: '<:cl_gem:1223407878094721165>',
		upvote: '<:cl_upvote:1223407882683289700>',
		downvote: '<:cl_downvote:1223407886508490762>',
		info: '<:cl_info:1223407870780117183>',
		link: '<:cl_link:1223407872919076985>',
		maintenance: '<:cl_maintenance:1223409177297424477>',
		heart1: '<:cl_heart:1223407863473639616>',
		heart2: '<a:cl_heart2:1220504936563867719>',
		settings: '<:cl_settings:1223405558367780964>',
		question: '<:cl_question:1223405541716660225>',
		mail: '<:cl_mail:1223419844083585045>',
		person: '<:cl_person:1223405547110535269>',
		pencil: '<:cl_pencil:1223421136453243031>',
		crown: '<:cl_crown:1223426598938607667>',
		boost: '<:cl_boost:1223426601799254057>',
		save: '<:cl_save:1223429188220883104>',
		friends: '<:cl_friends:1223405551191326721>',
		emoji1: '<:cl_emoji1:1223431397654397028>',
		emoji2: '<:cl_emoji2:1223431395502850161>',
		openfolder: '<:cl_openfolder:1223433141939605554>'
	}
};

const color = {
	default: '#674DF5',
	success: '#3bb143',
	fail: '#ff2626',
	warning: '#e9d502',
	invis: '#2b2d31',
	random: 'Random'
};

const channels = {
	commandLogging: '1218633186104311938',
	errorLogging: '1206107929372135454',
	blacklistLogging: '1218633358423363604',
	bugReports: '1218386554729271326'
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
