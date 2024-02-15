// Import necessary modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Import footer message from configuration file
const footer_message = require('../../config/footer');

// Array of developer IDs
const devIds = [
    '899385550585364481',
    '863508137080127518'
];

// Export the command module
module.exports = {
    // Define command data
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the latency of Beemo'),
    
    // Execute function to handle command execution
    async execute(interaction) {
        // Check if user is authorized to execute the command
        if (!devIds.includes(interaction.user.id)) {
            return await interaction.reply({ content: '<:bl_x_mark:1206436599794241576> You are not authorized to execute this command.', ephemeral: true });
        }

        try {
            // Send initial reply while fetching data
            const sent = await interaction.reply({ content: '<a:bl_loading:1206433137928708146> **Fetching Latency. . .**', fetchReply: true });
			// Calculate uptime in minutes
            const uptime = Math.round(interaction.client.uptime / 60000);
            // Convert uptime to hours and minutes
            const uptime_hours = Math.floor(uptime / 60);
  			const uptime_minutes = uptime % 60;
            
            // Create embed for displaying latency information
            const ping_embed = new EmbedBuilder()
                .setColor('#50a090')
                .setTitle('`✅` Latency Fetched')
                .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .addFields(
                    { name: '• Uptime:', value: `> <:bl_clock:1206612806560915547> \`${uptime_hours} hour${uptime_hours !== 1 ? 's' : ''} ${uptime_minutes} minute${uptime_minutes !== 1 ? 's' : ''}\``, inline: false },
                    { name: '• Websocket Heartbeat:', value: `> <a:bl_heart:1206471192962277396> \`${interaction.client.ws.ping} ms\`` },
                    { name: '• Latency:', value: `> <:bl_online:1206434279312195594> \`${sent.createdTimestamp - interaction.createdTimestamp} ms\`` }
                )
                .setTimestamp()

            // Edit original reply with embed containing latency information
            await interaction.editReply({ embeds: [ping_embed] });
            
        } catch (error) {
            console.error(error);
            // Create error embed if an error occurs during execution
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('`❌` Error Getting Latency')
                .setDescription('<:bl_x_mark:1206436599794241576> **• Beemo has encountered an error while trying to get the latency!**')
                .setTimestamp()
                .setFooter({ text: footer_message, iconURL: interaction.client.user.displayAvatarURL() });

            // Reply with the error embed
            await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    },
};
