// Import necessary modules and configurations
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const colors = require('../../config/colors');
const footer_message = require('../../config/footer')

// Array containing the IDs of authorized developers
const devIds = [
    '899385550585364481',
    '863508137080127518'
];

// Exporting the module
module.exports = {
    // Slash command data
    data: new SlashCommandBuilder()
        .setName('portal')
        .setDescription('Generate an invite link to a server (DEV ONLY)')
        .addStringOption(option =>
            option.setName('server_id')
                .setDescription('The ID of the server to generate the invite for.')
                .setRequired(true)),
    // Asynchronous function to execute the command
    async execute(interaction) {
        // Extracting the server ID from the interaction options
        const serverId = interaction.options.getString('server_id');
        // Creating a new embed object
        const embed = new EmbedBuilder();

        // Checking if the user invoking the command is authorized
        if (!devIds.includes(interaction.user.id)) {
            // Sending an error message if the user is not authorized
            await interaction.reply({ content: '`❌` You are not authorized to execute this command.', ephemeral: true });
            return;
        }

        // Getting the guild object from the cache using the provided server ID
        const guild = interaction.client.guilds.cache.get(serverId);

        // If the guild exists
        if (guild) {
            // Generating an invite for the guild
            const invite = await guild.channels.cache
                .filter(channel => channel.type !== ChannelType.GuildCategory)
                .first()
                .createInvite({
                    maxAge: 84600, // Invite link expiration time in seconds (24 hours)
                    maxUses: 0,    // Maximum number of times the invite can be used (unlimited)
                    unique: false  // Whether the invite link should be unique or not
                });

            // Reply to the interaction with a message containing the URL of the source bin
            const embed = new EmbedBuilder()
            .setTitle("`🔮` Portal Link")
            .setDescription(`<:bl_check_mark:1206436519498354738> **• ${interaction.user} The server link has been successfully created!**\n[Click here to join](https://discord.gg/${invite.code})`)
            .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setColor("#50a090")
            .setTimestamp();

            interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
            // Sending an error message if the guild could not be found in the cache
            await interaction.reply({ content: '`❌` Beemo couldn\'t find this guild in the cache', ephemeral: true });
        }
    },
};
