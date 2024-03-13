const { EmbedBuilder } = require('discord.js');
const Guild = require('../../../lib/schemas/blacklist');
const { color, emojis } = require('../../../config')

async function checkIfBlacklisted(guildId, interaction) {
    try {
        const find = await Guild.findOne({ guildId: guildId });
        if (find !== null) {
            const embed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`${emojis.reg.fail} Server Blacklisted`)
            .setDescription(`This server has been blacklisted by the owner of the bot. \n\n To find out more info please contact the server owner or join the ${interaction.client.user.displayName} Discord Server: https://discord.gg/AXwAMsB7G5`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });

            return 'blacklisted';
        } else {
            return 'no'
        }
    } catch (error) {
        console.log(error);
        return 'no'
    }
}

module.exports = { checkIfBlacklisted };