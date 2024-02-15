// Import necessary modules and dependencies
const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const Guild = require('../../schemas/blacklistSchema');
const footer_message = require('../../config/footer');

// Export module with Slash Command data and execution function
module.exports = {
    // Define Slash Command data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('blacklist-server')
        .setDescription('Blacklist or remove servers from the Beemo\'s blacklist')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a server to Beemo\'s blacklist')
                .addStringOption(option =>
                    option.setName('server-id')
                        .setDescription('The ID of the server to be added to Beemo\'s blacklist')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for blacklisting')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a server from Beemo\'s blacklist')
                .addStringOption(option =>
                    option.setName('server-id')
                        .setDescription('The ID of the server to be removed from Beemo\'s blacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all servers in Beemo\'s blacklist')),
    
    // Define asynchronous execution function for Slash Command
    async execute(interaction) {
        try {
            // Retrieve subcommand and reason from interaction options
            const action = interaction.options.getSubcommand();
            const reason = interaction.options.getString('reason') || 'No Reason Provided';

            // Switch based on the subcommand
            switch (action) {
                // Case for adding a server to blacklist
                case 'add':
                    // Retrieve server ID from interaction options
                    const guildId = interaction.options.getString('server-id');
                    // Find the target guild based on the provided ID
                    const targetGuild = interaction.client.guilds.cache.get(guildId);

                    // Check if the guild exists
                    if (!targetGuild) {
                        return await interaction.reply('<:bl_x_mark:1206436599794241576> **• Beemo has detected that this is an invalid server ID!**');
                    }

                    // Check if the guild is already blacklisted
                    const existingGuild = await Guild.findOne({ guildId: targetGuild.id });
                    if (existingGuild !== null) {
                        return await interaction.reply('<:bl_x_mark:1206436599794241576> **• This server has already been found in Beemo\'s blacklist!**');
                    }

                    // Create an embed for notification
                    const embed = new EmbedBuilder()
                        .setTitle('`📖` Blacklisted Servers')
                        .setColor("#50a090")
                        .setDescription(`<a:bl_redwarning:1207453255710277642> **Your server has been detected as blacklisted from using Beemo!**\n\n**• Server Name:** \`${targetGuild.name}\`\n**• Reason:** \`${reason}\` || "\`No Reason Provided.\`"}`)
                        .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setThumbnail(interaction.client.user.displayAvatarURL());

                    // Create a new document in the blacklist schema
                    await Guild.create({ guildId: targetGuild.id, reason });

                    // Create a button for ban appeal
                    const banAppealButton = new ButtonBuilder()
                        .setLabel("<:bl_ban:1207453823677767680> Beemo\'s Ban Appeal")
                        .setCustomId("ban_appeal")
                        .setStyle(ButtonStyle.Success);

                    // Create an action row containing the ban appeal button
                    const row = new ActionRowBuilder().addComponents(banAppealButton);
                    // Send the embed with button to the user
                    await interaction.user.send({ embeds: [embed], components: [row] });
                    // Leave the target guild
                    await targetGuild.leave();

                    // Respond to the interaction indicating success
                    await interaction.reply(`<a:bl_redwarning:1207453255710277642> **• The Server with ID \`${targetGuild.id}\` has been successfully added to Beemo\'s blacklist!\n\n**• Reason:** > \`${reason}\` || '> \`No Reason Provided.\`'}`);
                    break;

                // Case for removing a server from blacklist
                case 'remove':
                    // Retrieve server ID to remove from interaction options
                    const guildIdToRemove = interaction.options.getString('server-id');
                    // Find and delete the guild from blacklist
                    const removedGuild = await Guild.findOneAndDelete({ guildId: guildIdToRemove });

                    // Check if the guild was found and removed
                    if (!removedGuild) {
                        return await interaction.reply('<:bl_x_mark:1206436599794241576> **• This server has not been found in Beemo\'s blacklist!**');
                    }

                    // Respond to the interaction indicating success
                    await interaction.reply(`<:bl_check_mark:1206436519498354738> **• The Server with ID ${removedGuild.guildId} has been successfully removed from Beemo\'s blacklist!`);
                    break;

                // Case for listing all blacklisted servers
                case 'list':
                    // Find all blacklisted guilds
                    const blacklistedGuilds = await Guild.find();

                    // Create an embed for listing blacklisted guilds
                    const listEmbed = new EmbedBuilder()
                        .setColor("#50a090")
                        .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setDescription(
                            blacklistedGuilds.length > 0
                                ? blacklistedGuilds.map(guild => `**• Server ID:** > \`${guild.guildId}\`\n**• Reason:** > \`${guild.reason}\` || '> \`No Reason Provided.\`'}\n`).join('\n')
                                : '<:bl_x_mark:1206436599794241576> **• No servers have been detected in Beemo\'s blacklist!**'
                        );

                    // Respond to the interaction with the embed
                    await interaction.reply({ embeds: [listEmbed] });
                    break;

                // Default case for invalid actions
                default:
                    await interaction.reply('<a:bl_redwarning:1207453255710277642> **• Invalid action! Use `/blacklist add`, `/blacklist remove`, or `/blacklist list`!**');
                    break;
            }
        } catch (error) {
            // Catch and log any errors that occur during execution
            console.error(error);
            await interaction.reply({ content: '<:bl_x_mark:1206436599794241576> **• Beemo has encountered an error while processing your command!**', ephemeral: true });
        }
    },
};
