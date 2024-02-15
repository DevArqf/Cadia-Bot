const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user in the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the unmute')
                .setRequired(false)),

    async execute(interaction) {
        // Defining Things
        const userToUnmute = interaction.options.getUser('user');
        const unmuteMember = await interaction.guild.members.fetch(userToUnmute.id);
        const reason = interaction.options.getString('reason') || 'No Reason Provided';

        // Permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return await interaction.reply({ content: "`❌` • You must have the **Manage Channels** permission to use this command!", ephemeral: true });
        }
        if (!unmuteMember) {
            return await interaction.reply({ content: '`❌` • The user mentioned is no longer within the server!', ephemeral: true });
        }
        if (interaction.member.id === unmuteMember.id) {
            return interaction.reply({ content: "`❌` • You cannot unmute yourself!", ephemeral: true });
        }

        // Handle Unmute
        await handleUnmute(interaction, userToUnmute, unmuteMember, reason);
    }
};

async function handleUnmute(interaction, userToUnmute, unmuteMember, reason) {
    try {
        // Clear timeout for the user
        await unmuteMember.timeout(1000, reason);

        // Reply with confirmation
        const unmuteConfirmationEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('`✅` Successfully Unmuted User')
        .setDescription(`**${userToUnmute.tag}** has been Unmuted! \n\n**• Reason:**\n > \`${reason}\``)
        .setTimestamp()
        .setFooter({ text: `Unmuted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

        return interaction.reply({ embeds: [unmuteConfirmationEmbed], ephemeral: false });

    } catch (error) {
        console.error(error);

        const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('`❌` Error Unmuting User')
        .setDescription('Beemo has encountered an error while trying to unmute the user.')
        .setTimestamp()
        .setFooter({ text: 'Uh Oh... Beemo has encountered an error', iconURL: interaction.client.user.displayAvatarURL() })
            
        return interaction.reply({ embeds: [errorEmbed] });
    }
}
