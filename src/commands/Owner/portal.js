const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder, ChannelType } = require('discord.js');

// Array of developer IDs
const devIds = [
    '899385550585364481',
    '863508137080127518',
    '600707283097485322'
];

class BotOwner extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Generate an invite link to a server (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('portal')
				.setDescription(this.description)
                .addStringOption(option =>
                    option.setName('server_id')
                        .setDescription('The ID of the server to generate the invite for.')
                        .setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        // Extracting the server ID from the interaction options
        const serverId = interaction.options.getString('server_id');

        // Checking if the user invoking the command is authorized
        if (!devIds.includes(interaction.user.id)) {
            // Sending an error message if the user is not authorized
            await interaction.reply({ content: `${emojis.custom.fail} You are not **authorized** to **execute** this command.`, ephemeral: true });
            return;
        }

        // Getting the guild object from the cache using the provided server ID
        const guild = interaction.client.guilds.cache.get(serverId);

        // If the guild exists
        if (guild) {
            // Generating an invite for the guild
            const invite = await guild.channels.cache
                .filter(channel => channel.type !== ChannelType.GuildCategory)
                .first()
                .createInvite({
                    maxAge: 84600, // Invite link expiration time in seconds (24 hours)
                    maxUses: 0,    // Maximum number of times the invite can be used (unlimited)
                    unique: false  // Whether the invite link should be unique or not
                });

            // Reply to the interaction with a message containing the URL of the source bin
            const embed = new EmbedBuilder()
            .setTitle("`🔮` Portal Link")
            .setDescription(`${emojis.custom.success} ${interaction.user} The server link has been **successfully** created!\n[Click here to join](https://discord.gg/${invite.code})`)
            .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
            .setColor(`${color.success}`)
            .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
            // Sending an error message if the guild could not be found in the cache
            await interaction.reply({ content: `${emojis.custom.fail} I **couldn\'t** find this guild in the cache`, ephemeral: true });
        }
    }
};

module.exports = {
	BotOwner
};