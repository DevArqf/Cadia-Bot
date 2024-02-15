const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unbanning the user')
                .setRequired(true)),

    async execute(interaction) {
        // Defining Things
        const userToUnban = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        // Permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({ content: "❌ You must have the **Ban Members** permission to use this command!", ephemeral: true });
        }

        // Unban the user
        interaction.guild.bans.remove(userToUnban.id, reason)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('`✅` Unban Successful')
                    .setDescription(`**${userToUnban.tag}** has been unbanned from the server.`)
                    .addFields({ name: '• Reason:', value: reason })
                    .setTimestamp()
                    .setFooter({ text: `Unbanned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

                interaction.reply({ content: '', embeds: [embed] });
            })
            .catch(error => {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('`❌` Error Unbanning User')
                    .setDescription(`Beemo has failed to unban **${userToUnban.tag}** from the server.`)
                    .setTimestamp()
                    .setFooter({ text: 'Uh Oh... Beemo has encountered an error', iconURL: interaction.client.user.displayAvatarURL() });

                interaction.reply({ content: '', embeds: [errorEmbed] });
            });
    },
};
