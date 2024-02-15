const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking the user')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('picture')
                .setDescription('Attach a picture related to the kick')
                .setRequired(false)),

    async execute(interaction) {
        // Defining Things
        const userToKick = interaction.options.getUser('user');
        const kickMember = await interaction.guild.members.fetch(userToKick.id);
        const reason = interaction.options.getString('reason');
        const picture = interaction.options.getAttachment('picture');

        // Permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({ content: "❌ You must have the **Kick Members** permission to use this command!", ephemeral: true });
        }
        if (!kickMember) {
            return await interaction.reply({ content: '❌ The user mentioned is no longer within the server!', ephemeral: true });
        }
        if (!kickMember.kickable) {
            return await interaction.reply({ content: "❌ I cannot kick this user because they are either higher than me or you!", ephemeral: true });
        }
        if (interaction.member.id === kickMember.id) {
            return interaction.reply({ content: "❌ You cannot kick yourself!", ephemeral: true });
        }
        if (kickMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "❌ You cannot kick staff members or people with the Administrator permission!", ephemeral: true });
        }

        // DM Message
        try {
            const dmEmbed = {
                color: '#ff5555',
                title: `🚫 You have been kicked from **${interaction.guild.name}**`,
                thumbnail: { url: interaction.guild.iconURL() },
                fields: [
                    { name: 'Kicked by:', value: interaction.user.tag },
                    { name: 'Reason:', value: reason }
                ],
                timestamp: new Date()
            };

            await userToKick.send({ embeds: [dmEmbed] }).catch(error => console.error(`Beemo could not send DM to ${userToKick.tag}.`, error));

            // Kick Successful
            const kickConfirmationEmbed = {
                color: '#00ff00',
                title: '`✅` Kick Successful',
                description: `**${userToKick.tag}** has been kicked from the server.`,
                fields: [{ name: 'Reason:', value: reason }],
                timestamp: new Date(),
                footer: { text: `Kicked by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() }
            };

            // Kick Failed
            await interaction.guild.members.kick(userToKick, { reason: `Kicked by ${interaction.user.tag}: ${reason}` });
            await interaction.reply({ content: '', embeds: [kickConfirmationEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = {
                color: '#ff0000',
                title: '`❌` Error Kicking User',
                description: `Beemo has Failed to kick **${userToKick.tag}** from the server.`,
                timestamp: new Date(),
                footer: { text: 'Uh Oh... Beemo has encountered an error', iconURL: interaction.client.user.displayAvatarURL() }
            };
            await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    },
};
