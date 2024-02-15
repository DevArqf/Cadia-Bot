const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the banning the user')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('picture')
                .setDescription('Attach a picture related to the ban')
                .setRequired(false)),

    async execute(interaction) {
        // Defining Things
        const userToBan = interaction.options.getUser('user');
        const banMember = await interaction.guild.members.fetch(userToBan.id);
        const reason = interaction.options.getString('reason');
        const picture = interaction.options.getAttachment('picture');

        // Permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({ content: "❌ You must have the **Ban Members** permission to use this command!", ephemeral: true});
        }

        if (!banMember) {
            return await interaction.reply({ content: '❌ The user mentioned is no longer within the server!', ephemeral: true});
        }

        if (!banMember.kickable) {
            return await interaction.reply({ content: "❌ I cannot ban this user because they are either higher than me or you!", ephemeral: true});
        }

        if (interaction.member.id === banMember.id) {
            return interaction.reply({content: "❌ You cannot ban yourself!", ephemeral: true});
        }

        if (banMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({content: "❌ You cannot ban staff members or people with the Administrator permission!", ephemeral: true});
        }

        // DM Message
        try {
            const dmEmbed = new EmbedBuilder()
                .setColor('#ff5555')
                .setTitle(`🚫 You have been banned from **${interaction.guild.name}**`)
                .setDescription(`**Server:** ${interaction.guild.name}\n**• Reason:** ${reason}`)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            if (picture) {
                dmEmbed.setImage(picture.url);
                dmEmbed.addFields({ name: 'Related Image:', value: '`👇` See below `👇`' });
            }

            await userToBan.send({ embeds: [dmEmbed] }).catch(error => console.error(`Beemo could not send DM to ${userToBan.tag}.`, error));
            
            // Ban Successful
            const banConfirmationEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('`✅` Ban Successful')
                .setDescription(`**${userToBan.tag}** has been banned from the server.`)
                .addFields({ name: '• Reason:', value: reason })
                .setTimestamp()
                .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            //Ban Failed
            await interaction.guild.members.ban(userToBan, { reason: `Banned by ${interaction.user.tag}: ${reason}` });
            await interaction.reply({ content: '', embeds: [banConfirmationEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('`❌` Error Banning User')
                .setDescription(`Beemo has Failed to ban **${userToBan.tag}** from the server.`)
                .setTimestamp()
                .setFooter({ text: 'Uh Oh... Beemo has encountered an error', iconURL: interaction.client.user.displayAvatarURL() });
            await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    },
};
