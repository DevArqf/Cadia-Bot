const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');
const Guild = require('../schemas/blacklistSchema');

module.exports = {
    async execute(client) {
        client.on('guildCreate', async (guild) => {
            try {
                const blacklistedGuild = await Guild.findOne({
                    guildId: guild.id
                });

                if (blacklistedGuild) {
                    try {
                        const Row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                            .setLabel("`🔐` Ban Appeal")
                            .setCustomId("ban_appeal")
                            .setStyle(Discord.ButtonStyle.Success)
                        )
                        const owner = await client.users.fetch(guild.ownerId);
                        const embed = new EmbedBuilder()
                        .setTitle('`🚫` Blacklisted')
                        .setColor("#50a090")
                        .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setDescription(`<a:bl_redwarning:1207453255710277642> **• Your server has been detected as blacklisted from using Beemo!**\n\n**• Server Name:** > \`${guild}\`\n**• Reason:** > \`${blacklistedGuild.reason}\` || "> \`No Reason Was Provided\`"}`)
                        await owner.send({
                            embeds: [embed], components: [Row]
                        });
                        await guild.leave();
                    } catch (err) {
                        console.error('Beemo has encountered an error while trying to DM the server owner:', err);
                    }
                }
            } catch (error) {
                console.error('Beemo has encountered an error in the Blacklist Server Create event:', error);
            }
        });
    },
};