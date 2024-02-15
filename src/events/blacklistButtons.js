const Discord = require("discord.js");
const Guild = require('../schemas/blacklistSchema');

module.exports = {
    async execute(client) {
        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            if (interaction.customId === "ban_appeal") {
                const modal = new Discord.ModalBuilder()
                .setCustomId('ban_appeal_modal')
                .setTitle('Blacklist Appeal');
                const Q1 = new Discord.TextInputBuilder()
                .setCustomId('question_1')
                .setLabel("Server ID")
                .setStyle(Discord.TextInputStyle.Short);
                const Q2 = new Discord.TextInputBuilder()
                .setCustomId('question_2')
                .setLabel("What was the reason of your server being blacklisted?")
                .setStyle(Discord.TextInputStyle.Short);

                const Q3 = new Discord.TextInputBuilder()
                .setCustomId('question_3')
                .setLabel("How will you prevent future issues?")
                .setStyle(Discord.TextInputStyle.Paragraph);

                const firstActionRow = new Discord.ActionRowBuilder().addComponents(Q1);
                const secondActionRow = new Discord.ActionRowBuilder().addComponents(Q2);
                const thirdActionRow = new Discord.ActionRowBuilder().addComponents(Q3);

                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

                await interaction.showModal(modal);

            };
            if (interaction.customId === "blacklist_appeal_accept") {
                const guildId = interaction.message.embeds[0].fields[2].value;
                const blacklistedGuild = await Guild.findOneAndDelete({
                    guildId
                });
                const guild = client.guilds.cache.get(guildId);
                if (!blacklistedGuild) {
                    await interaction.reply({
                        content: "<:bl_x_mark:1206436599794241576> **• This server is not blacklisted!**", ephemeral: true
                    })
                };
                const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel("<:bl_check_mark:1206436519498354738> • Accepted")
                    .setCustomId("blacklist_appeal_accept")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(true),
                    new Discord.ButtonBuilder()
                    .setLabel("<:bl_x_mark:1206436599794241576> • Deny")
                    .setCustomId("blacklist_appeal_deny")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setDisabled(true)
                )
                interaction.message.edit({
                    components: [row]
                })
                await interaction.reply({
                    content: "<:bl_check_mark:1206436519498354738> **• Beemo has successfully removed the server from the blacklist!**", ephemeral: true
                })

                const userId = interaction.message.embeds[0].fields[1].value;
                const user = client.users.cache.get(userId)
                await user.send({
                    content: `<:bl_tada:1207462996859682918> **• Your blacklist appeal has been accepted! You are now allowed to use Beemo in \`${guild}\`**`
                })
            };
            if (interaction.customId === "blacklist_appeal_deny") {
                const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel("<:bl_check_mark:1206436519498354738> • Accept")
                    .setCustomId("blacklist_appeal_accept")
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(true),
                    new Discord.ButtonBuilder()
                    .setLabel("<:bl_x_mark:1206436599794241576> • Denied")
                    .setCustomId("blacklist_appeal_deny")
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setDisabled(true)
                )
                interaction.message.edit({
                    components: [row]
                })
                const guildId = interaction.message.embeds[0].fields[2].value;
                const guild = client.guilds.cache.get(guildId);
                const userId = interaction.message.embeds[0].fields[1].value;
                const user = client.users.cache.get(userId)
                await user.send({
                    content: `<:bl_x_mark:1206436599794241576> **• Your blacklist appeal has unfortunately been denied, you still cannot use Beemo in \`${guild}\`**`
                })
                interaction.reply({
                    content: "<:bl_x_mark:1206436599794241576> **• Beemo has denied your blacklist appeal!**", ephemeral: true
                })

            };
        })
    }
}