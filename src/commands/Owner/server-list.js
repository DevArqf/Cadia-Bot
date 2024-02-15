// Import necessary modules
const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const sourcebin = require("sourcebin_js"); // Library for creating and managing source code bins
const footer_message = require('../../config/footer') // Path for embed's footer

// Export a module with the command data and execute function
module.exports = {
  // Slash command data
  data: new SlashCommandBuilder()
    .setName("server-list")
    .setDescription("Shows all of the servers Beemo is in (DEV ONLY)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  /**
   * Execute function for the command
   * @param {CommandInteraction} interaction - The interaction object representing the command interaction
   * @param {Client} client - The Discord.js client instance
   */
  async execute(interaction, client) {
    // Initialize an empty string to store server list
    let list = "";

    // Iterate through each guild (server) that the bot is in
    client.guilds.cache.forEach((guild) => {
      // Append guild name, ID, member count, and owner ID to the list string
      list += `${guild.name} (${guild.id}) | ${guild.memberCount} Members | Owner: ${guild.ownerId}\n`;
    });

    // Create a new source bin with the server list content
    sourcebin
      .create([
        {
          name: `Beemo's Server List - Code By Beemo`, // Name of the source bin
          content: list, // Content of the source bin (server list)
          languageId: "js", // Language identifier (JavaScript)
        },
      ])
      // Once the source bin is created
      .then((src) => {
        // Reply to the interaction with a message containing the URL of the source bin
        const embed = new EmbedBuilder()
          .setTitle("`📁` Server List")
          .setDescription(`<:bl_check_mark:1206436519498354738> **• Beemo's Server List has been successfully generated!**\n[Click here to view](${src.url})`)
          .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
          .setThumbnail(interaction.client.user.displayAvatarURL())
          .setColor("#50a090")
          .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
      });
  },
};
