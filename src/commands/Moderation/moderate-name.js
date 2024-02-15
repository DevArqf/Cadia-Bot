const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const footer_message = require('../../config/footer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderate-name')
        .setDescription('Moderate a users name')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to moderate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the banning the user')
                .setRequired(false)),

    async execute(interaction) {
        // Defining Things
        const userToModerate = await interaction.options.getUser('user');
        const ModerateUser = await interaction.guild.members.fetch(userToModerate.id);
        const reason = interaction.options.getString('reason') || 'No Reason Provided';
        const nickname = `Moderated Name ${Math.floor(Math.random() * 9999) + 1000}`;

        // Permissions
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return await interaction.reply({ content: "❌ You must have the **Manage Nicknames** permission to use this command!", ephemeral: true});
        if(!ModerateUser) return await interaction.reply({ content: '❌ The user mentioned is no longer within the server!', ephemeral: true});
        if(!ModerateUser.kickable) return await interaction.reply({ content: "❌ Beemo cannot ban this user because they are either higher than me or you!", ephemeral: true});
        if (interaction.member.id === ModerateUser.id) return interaction.reply({content: "❌ You cannot moderate your own name!", ephemeral: true});
        if (ModerateUser.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({content: "❌ You cannot moderate staff members or people with the Administrator permission!", ephemeral: true});

        try {
            ModerateUser.setNickname(nickname, reason);

            const completed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('`✅` Name Successfully Moderated')
                .setDescription(`**${userToModerate.tag}**'s has been moderated! \n\n**New Nickname:**\n > ${nickname} \n\n**Reason:**\n > \`${reason}\``)
                .setTimestamp()
                .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })

                return interaction.reply({ embeds: [completed], ephemeral: false });

        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                      .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
        			  .setColor('#FF0000')
        			  .setTitle('`❌` Error Moderating Username')
        			  .setDescription('Uh Oh... Beemo has encountered an error while trying to moderate the user nickname')
       				  .setTimestamp();
            await interaction.reply({ content: '', embeds: [errorEmbed] });
            }
    }
};