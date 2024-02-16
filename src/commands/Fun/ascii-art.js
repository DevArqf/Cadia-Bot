const { SlashCommandBuilder } = require("discord.js");
const ascii = require('ascii-art');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ascii")
        .setDescription("Create Ascii Art")
        .addStringOption(option => option
            .setName("text")
            .setDescription("The text")
            .setRequired(true)
        ),

    async execute(interaction) {
        const text = interaction.options.getString("text");

        ascii.font(text, 'Doom', (err, rendered) => {
            if (err) {
                interaction.reply(`Error: ${err}`);
            } else {
                interaction.reply(`\`\`\`${rendered}\`\`\``);
            }
        });
    }
};
