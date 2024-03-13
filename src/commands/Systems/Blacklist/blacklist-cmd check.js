const { EmbedBuilder } = require('discord.js');
const Guild = require('../../../lib/schemas/blacklist');
const { color, emojis } = require('../../../config')

async function checkIfBlacklisted(guildId, interaction) {
    try {
        const find = await Guild.findOne({ guildId: guildId });
        if (find !== null) {
            const embed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`\`🚫\` Server Blacklisted!`)
            .setDescription(`This server has been blacklisted. \n\n For more info or to appeal your blacklist, please contact us by joining our Support Server [here](https://discord.gg/AXwAMsB7G5)`)
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