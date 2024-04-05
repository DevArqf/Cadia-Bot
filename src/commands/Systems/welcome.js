const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { WelcomeSchema } = require('../../lib/schemas/welcome');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
            name: 'welcome',
			description: 'Setup an automatic welcome for your discord server',
            requiredUserPermissions: ['ManageGuild']
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)

                //Setup Subcommand
                .addSubcommand((subcommand) =>
					subcommand //
						.setName('setup')
						.setDescription('Setup welcomer for your discord server')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send the welcome to')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption((option) =>
                        option
                            .setName('type')
                            .setDescription('The message type')
                            .addChoices(
                                { name: '• Regular', value: 'regular' },
                                { name: '• Embed', value: 'embed' },
                            )
                            .setRequired(true))
                .addStringOption((option) =>
                        option
                            .setName('message')
                            .setDescription('The message to send')
                            .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('embed-title')
                        .setDescription('The embed title')
                        .setRequired(false))
                        
                .addStringOption((option) =>
                    option
                        .setName('embed-hex')
                        .setDescription('The embed hex code')
                        .setRequired(false)) 
                .addStringOption((option) =>
                    option
                        .setName('embed-footer')
                        .setDescription('The embed footer')
                        .setRequired(false))
                .addStringOption((option) =>
                    option
                        .setName('embed-thumbnailurl')
                        .setDescription('The embed thumbnail url')
                        .setRequired(false))
                .addStringOption((option) =>
                    option
                        .setName('embed-authorname')
                        .setDescription('The embed author name')
                        .setRequired(false))
                .addStringOption((option) =>
                    option
                        .setName('embed-iconurl')
                        .setDescription('The embed thumbnail url')
                        .setRequired(false))
                )

                // Disable SubCommand
                .addSubcommand((subcommand) =>
                        subcommand 
                            .setName('disable')
                            .setDescription('Disable welcomer for the server'))
                // Vars SubCommand
                .addSubcommand((subcommand) => 
                        subcommand
                            .setName('vars')
                            .setDescription('Get all the vairables for this system.')),
                 
        );
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            const channelID = interaction.options.getChannel('channel').id;
            const messageType = interaction.options.getString('type');
            const message = interaction.options.getString('message');
            const find = await WelcomeSchema.findOne({ guildId: interaction.guild.id });
            if (!find === null) {
                    return await interaction.reply(`${emojis.custom.fail} This server has **already** setup welcomer.`);
            } else {

            // await WelcomeSchema.create({ guildId: interaction.guild.id, welcomeChannelId: channelID, messageType: messageType, messageInfo: { title: null, message: null, footer: null, hexCode: null} });

            if (messageType === 'regular') {
                return SendMessage(interaction);
            } else {
                const title = interaction.options.getString('embed-title');
                const footer = interaction.options.getString('embed-footer');
                const hexCode = interaction.options.getString('embed-hex');
                const thumbnailURL = interaction.options.getString('embed-thumbnailurl');
                const authorName = interaction.options.getString('embed-authorname');
                const iconURL = interaction.options.getString('embed-iconurl')

                if (iconURL) {
                    if (!iconURL.startsWith('https://') && !iconURL.startsWith('http://')) {
                        const iconURLError = new EmbedBuilder()
                        .setColor(color.fail)
                        .setTitle(`${emojis.reg.fail} Icon URL Error`)
                        .setDescription('You have inputed a invalaid Icon URL')
                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })

                        return await interaction.reply({ embeds: [iconURLError] });
                    }
                };

                if (thumbnailURL) {
                    if (!thumbnailURL.startsWith('https://') && !thumbnailURL.startsWith('http://')) {
                        const thumbnailError = new EmbedBuilder()
                        .setColor(color.fail)
                        .setTitle(`${emojis.reg.fail} Thumbnail URL Error`)
                        .setDescription('You have inputed a invalaid Thumbnail URL')
                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })

                        return await interaction.reply({ embeds: [thumbnailError] });
                    }
                };

                if (hexCode) {
                    if (!typeof !hexCode.length === 6 && !hexCode.startsWith('#')) {
                        const hexError = new EmbedBuilder()
                        .setColor(color.fail)
                        .setTitle(`${emojis.reg.fail} Hex Code Error`)
                        .setDescription('You have inputed a incorrect Hex Code')
                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })

                        return await interaction.reply({ embeds: [hexError] });
                    }
                };
                await WelcomeSchema.create({ guildId: interaction.guild.id, welcomeChannelId: channelID, messageType: messageType, message: ' ', title: null, footer: null, thumbnailImage: null, authorName: null, iconURL: null, hexCode: null });

                await WelcomeSchema.findOneAndUpdate({ guildId: interaction.guild.id }, { title: title, message: message, footer: footer, thumbnailImage: thumbnailURL, authorName: authorName, iconURL: iconURL, hexCode: hexCode }, { upsert: false });
                return SendMessage(interaction);
            }


            async function SendMessage(interaction) {
            const CreatedEmbed = new EmbedBuilder()
                .setColor(`${color.success}`)
                .setTitle(`${emojis.reg.success} Welcomer Setup`)
                .setDescription(`**Welcocmer Has Been Setup**\n\n **Channel:**\n${emojis.custom.replyend} <#${channelID}>`)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

            return await interaction.reply({ embeds: [CreatedEmbed] })
            }
        }
            
        };

        if (subcommand === 'disable') {
            const find = await WelcomeSchema.find({ guildId: interaction.guild.id });
            if (!find) {
                const cantDisable = new EmbedBuilder()
                    .setColor(color.warning)
                    .setTitle(`Cant Disable Welcomer`)
                    .setDescription(`I can't disable welcomer as it has **not** been setup`)
                return await interaction.reply({ embeds: [cantDisable] });
            } else {
                await WelcomeSchema.deleteOne({ guildId: interaction.guild.id });
                const Deleted = new EmbedBuilder()
                    .setColor(color.success)
                    .setTitle(`${emojis.custom.success} Welcomer Disabled`)
                    .setDescription(`Welcomer has been **successfully** disabled for **${interaction.guild.name}**`)
                return await interaction.reply({ embeds: [Deleted] });
            }
        };

        if (subcommand === 'vars') {
            const embed = new EmbedBuilder()
                .setColor(color.default)
                .setTitle('Welcomer Vairables')
                .addFields([
                    { name: '**Title:**',  value: `${emojis.custom.replycontinue} \`{userId}\` Get the users name\n${emojis.custom.replycontinue} \`{serverName}\` Get the servers name\n${emojis.custom.replyend} \`{serverMembers}\` Get the total member count of the server` },
                    { name: '**Message:**', value: `${emojis.custom.replycontinue} \`{userId}\` Get the users name\n${emojis.custom.replycontinue} \`{userMention}\` Mention the user who joined\n${emojis.custom.replycontinue} \`{serverName}\` Get the servers name\n${emojis.custom.replycontinue} \`{serverMembers}\` Get the total member count of the server\n${emojis.custom.replycontinue} \`\\n\` Use this to make a new line in a message` },
                    { name: '**Footer:**', value: `${emojis.custom.replycontinue} \`{userId}\` Get the users name\n${emojis.custom.replycontinue} \`{serverName}\` Get the servers name\n${emojis.custom.replyend} \`{serverMembers}\` Get the total member count of the server` }
                ])
                .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

                return interaction.reply({ embeds: [embed] });
        }


        }
    };

module.exports = {
	UserCommand
};
