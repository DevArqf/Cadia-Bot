const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../../config');
const Guild = require('../../../lib/schemas/blacklist');
 
class UserCommand extends BeemoCommand {
    /**
     * @param {BeemoCommand.Context} context
     * @param {BeemoCommand.Options} options
     */
    constructor(context, options) {
        super(context, {
            ...options,
            permissionLevel: PermissionLevels.BotOwner,
            description: "Blacklist a server, restricting them from using Cadia Bot"
        });
    }
 
    /**
     * @param {BeemoCommand.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName('blacklist-add')
                .setDescription(this.description)
                .addStringOption(option =>
                    option.setName('server-id')
                        .setDescription('The ID of the server to be added to my blacklist')
                        .setRequired(true))
                        .addStringOption(option =>
                            option.setName('reason')
                                .setDescription('Reason for blacklisting')))
    }
 
    /**
     * @param {BeemoCommand.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction, client) {
        try {
            const reason = interaction.options.getString('reason') || 'No Reason Provided';
            const guildId = interaction.options.getString('server-id');
            const targetGuild = interaction.client.guilds.cache.get(guildId);
            
            const logChannel = interaction.client.channels.cache.get(logChannelId);

            if (Number.isNaN(guildId)) {
                return await interaction.reply(`${emojis.custom.fail} You ahve inputed a character that is not a number`);
            }

            const existingGuild = await Guild.findOne({ guildId: targetGuild.id });
                if (existingGuild !== null) {
                    return await interaction.reply(`${emojis.custom.fail} This server has **already** been **found** in my blacklist!`);
                }

            if (!targetGuild) {
                await Guild.create({ guildName: 'No Name Found', guildId: guildId, reason: `${reason}, Bot not in guild` });
                const logEmbed = new EmbedBuilder()
                .setTitle('- Server Blacklisted')
                .setColor(`${color.random}`)
                .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`**Server Name**\n ${emojis.custom.replyend} \`No Name Found\`\n -**Server ID**\n ${emojis.custom.replyend} \`${guildId}\`\n - **Owner ID**\n ${emojis.custom.replyend} \`Owner Id not found\`\n - **Reason**\n ${emojis.custom.replyend} \`${reason}, Bot not in guild\``)
                .setTimestamp();

                return await interaction.reply(`${emojis.custom.warning} The server with the ID \`${guildId}\` has been successfully **added** to my blacklist!\n\n**- Reason:**\n${emojis.custom.replyend} \`${reason}, Bot not in guild\``);
            }
 
            const embed = new EmbedBuilder()
                .setTitle('- You have been Blacklisted!')
                .setColor(`${color.default}`)
                .setDescription(`${emojis.custom.warning} Your server has been **blacklisted** from using **${interaction.client.user.displayName}**!\n\n** - Server Name:**\n ${emojis.custom.replyend} \`${targetGuild.name}\`\n** - Reason:**\n ${emojis.custom.replyend} \`${reason}\``)
                .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setTimestamp();
 
            const ownerId = targetGuild.ownerId; // Get the owner ID
            const guildName = targetGuild.name;
            const logChannelId = '1208553649337405440'; // Change this to your log channel ID
             

 
            const logEmbed = new EmbedBuilder()
                .setTitle('- Server Blacklisted')
                .setColor(`${color.random}`)
                .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`**Server Name**\n ${emojis.custom.replyend} \`${guildName}\`\n -**Server ID**\n ${emojis.custom.replyend} \`${targetGuild.id}\`\n - **Owner ID**\n ${emojis.custom.replyend} \`${ownerId}\`\n - **Reason**\n ${emojis.custom.replyend} \`${reason}\``)
                .setTimestamp();
 
            await logChannel.send({ embeds: [logEmbed] });
 
            await Guild.create({ guildName: targetGuild.name, guildId: targetGuild.id, reason });
 
            await interaction.user.send({ embeds: [embed] });
 
            await interaction.reply(`${emojis.custom.warning} The server with the ID \`${targetGuild.id}\` has been successfully **added** to my blacklist!\n\n**- Reason:**\n${emojis.custom.replyend} \`${reason}\``);
 
        } catch (error) {
            console.error(error);
 
            const errorEmbed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`${emojis.custom.fail} Blacklist Add Error`)
            .setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            .setTimestamp();
 
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
            }
        }
    };
 
module.exports = {
    UserCommand
};