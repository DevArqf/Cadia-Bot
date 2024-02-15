const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const createBuilder = require('discord-command-builder');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('generate-command')
    .setDescription('Generate code for your Discord Bot!'),
    
    async execute (interaction) {
        createBuilder({ interaction: interaction, path: './cache/'}).catch(async err => {
            return await interaction.reply({ content: `<:bl_x_mark:1206436599794241576> Beemo has encountered an error while generating the command!`, ephemeral: true });
        })
    }
}