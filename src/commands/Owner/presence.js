// Import necessary modules from discord.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// Import footer message from configuration file
const footer_message = require('../../config/footer')

// Array of developer user IDs
const devIds = [
    '899385550585364481',
    '863508137080127518'
];

// Exporting module containing slash command data and execute function
module.exports = {
    // Slash command data
    data: new SlashCommandBuilder()
        .setName("presence")
        .setDescription("Change Beemo's presence")
        .addStringOption(option => option
            .setName("type")
            .setDescription("The presence type")
            .addChoices(
                { name: "• 🌙 Idle", value: "Idle" },
                { name: "• 🟢 Online", value: "Online" },
                { name: "• ⭕ DND", value: "Do not disturb" },
                { name: "• 👀 Invisible", value: "Invisible" }
            )
            .setRequired(true)
        ),
    
    // Execute function handling command execution
    async execute(interaction, client) {
        // Extract the presence type from user interaction
        const presence = interaction.options.getString('type');

        try {
            // Check if the user is authorized (is a developer)
            if (!devIds.includes(interaction.user.id)) {
                // If not authorized, reply with an error message
                return await interaction.reply({
                    content: `<:bl_x_mark:1206436599794241576> **Error:** \`Beemo cannot set presence to ${presence}\` because you don't have permission to execute this command!`,
                    ephemeral: true
                });
            }

            // Create an embed to send as a response
            const embed = new EmbedBuilder()
                .setTitle("`💡` Beemo's Presence")
                .setDescription(`<:bl_check_mark:1206436519498354738> **• Beemo's presence has been successfully set to ${presence}**!`)
                .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setColor("#50a090")
                .setTimestamp();

            // Set Beemo's presence based on the given type
            if (presence === 'Online') {
                client.user.setPresence({ status: 'online' });
            } else if (presence === 'Idle') {
                client.user.setPresence({ status: 'idle' });
            } else if (presence === 'Do not disturb') {
                client.user.setPresence({ status: 'dnd' });
            } else if (presence === 'Invisible') {
                client.user.setPresence({ status: 'invisible' });
            }

            // Reply with the embed indicating the presence change
            return await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            // If any error occurs during execution, send it to the channel as a message
            interaction.channel.send({ content: ` \`\`\`js\n${error}\`\`\` `, ephemeral: true });
        }
    }
};
