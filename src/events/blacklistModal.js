const Discord = require("discord.js");

module.exports = {
    async execute(client) {
        client.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId === "ban_appeal_modal") {

                const guildId = interaction.fields.getTextInputValue("question_1")
                const guild = client.guilds.cache.get(guildId)
                if (!guild) {
                    interaction.reply("<:bl_warning:1206435135701123073> **• Please put valid server ID!**")
                }
                await interaction.reply({
                    content: "<:bl_check_mark:1206436519498354738> **• Your appeal has been successfully submitted to the Support Team!**", ephemeral: true
                })
                await interaction.message.edit({
                    components: []})
                const q1 = interaction.fields.getTextInputValue("question_2")
                const q2 = interaction.fields.getTextInputValue("question_3")
                const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setLabel("<:bl_check_mark:1206436519498354738> • Accept")
                    .setCustomId("blacklist_appeal_accept")
                    .setStyle(Discord.ButtonStyle.Success),
                    new Discord.ButtonBuilder()
                    .setLabel("<:bl_x_mark:1206436599794241576> • Deny")
                    .setCustomId("blacklist_appeal_deny")
                    .setStyle(Discord.ButtonStyle.Danger)
                )
                const embed = new Discord.EmbedBuilder()
                .setTitle("`🚫` Blacklist Appeal")
                .setDescription("Appeal your blacklist and have a chance to be removed from Beemo\'s blacklist.")
                .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .addFields(
                    {
                        name: `**• Requested By**`, value: `> \`[${interaction.user.username}](https://discord.com/users/${interaction.user.id})\``, inline: true
                    },
                    {
                        name: "**• Submitter ID**", value: `> \`${interaction.user.id}\``, inline: true
                    },
                    {
                        name: "**• Server ID**", value: `> \`${guildId}\``, inline: true
                    },
                    {
                        name: "**• Reason**", value: `> \`${q1}\``, inline: true
                    },
                    {
                        name: "**• Request**", value: `> \`${q2}\``, inline: true
                    },
                )
                const channel = client.channels.cache.get("1207458345255174226")
                await channel.send({
                    embeds: [embed], components: [row]
                })
            }
        })
    }
}