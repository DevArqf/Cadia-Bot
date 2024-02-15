const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const footer_message = require('../../config/footer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Get Information of the server'),
                        
    async execute(interaction) {
        try {
            const server_made = new Date(String(interaction.guild.createdAt)).getTime()/1000;
            const server_icon = interaction.guild.iconURL({ dynamic: true, format: 'png', size: 256 });
            
            const emoji_reg = interaction.guild.emojis.cache.filter(emoji => !emoji.animated).size;
            const emoji_animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size;
            const boostLevel = interaction.guild.premiumTier;
            const maxEmojis = 50 + boostLevel * 50;
            
            if (server_icon === null) {
                const embed = new EmbedBuilder()
        	.setColor('#50a090')
            .setTitle(`\`⚙️\` ${interaction.guild.name}'s Info`)
            .addFields(
                { name: 'Server Name:', value: `> \`${interaction.guild.name}\``},
                { name: 'Owner:', value: `> ${await interaction.guild.fetchOwner()}` },
                { name: 'Boost Tier:', value: `> \`${boostLevel}\`` },
                { name: 'Member Count:', value: `> \`${interaction.guild.memberCount}\`` },
                { name: 'Channel Count:', value: `> \`${interaction.guild.channels.cache.size}\`` },
                { name: 'Role Count:', value: `> \`${interaction.guild.roles.cache.size}\`` },
                { name: 'Emoji count:', value: `> **Regular emojis:**\n > \`${emoji_reg}/${maxEmojis}\`\n\n > **Animated emojis:**\n > \`${emoji_animated}/${maxEmojis}\`` },
                { name: 'Server Icon:', value: `> \`None\``},
                { name: 'Server Creation:', value: `> \`Created:\` <t:${server_made}:R>` }
                )
       		.setTimestamp()
            .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
            
        await interaction.reply({
            embeds: [embed]
        });
            } else {

        const embed_with_icon = new EmbedBuilder()
        	.setColor('#50a090')
            .setTitle(`\`⚙️\` ${interaction.guild.name}'s Info`)
            .addFields(
                { name: 'Server Name:', value: `> \`${interaction.guild.name}\``},
                { name: 'Owner:', value: `> ${await interaction.guild.fetchOwner()}` },
                { name: 'Boost Tier:', value: `> \`${boostLevel}\`` },
                { name: 'Member Count:', value: `> \`${interaction.guild.memberCount}\`` },
                { name: 'Channel Count:', value: `> \`${interaction.guild.channels.cache.size}\`` },
                { name: 'Role Count:', value: `> \`${interaction.guild.roles.cache.size}\`` },
                { name: 'Emoji count:', value: `> **Regular emojis:**\n > \`${emoji_reg}/${maxEmojis}\`\n\n > **Animated emojis:**\n > \`${emoji_animated}/${maxEmojis}\`` },
                { name: 'Server Icon:', value: `> [Click Here](${server_icon})` },
                { name: 'Server Creation:', value: `> \`Created:\` <t:${server_made}:R>` }
                )
       		.setTimestamp()
            .setThumbnail(server_icon)
            .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
            
        await interaction.reply({
            embeds: [embed_with_icon]
        });
    };

        } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('`❌` Error Getting Information')
            .setDescription(`Beemo has encountered an error while getting Information`)
            .setTimestamp()
        await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    }

};