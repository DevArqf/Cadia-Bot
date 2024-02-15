const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

const answers = [
    '🎱 **|** It is certain', 
    '🎱 **|** Reply hazy, try again', 
    '🎱 **|** Don’t count on it', 
    '🎱 **|** It is decidedly so', 
    '🎱 **|** Ask again later', 
    '🎱 **|** My reply is no', 
    '🎱 **|** Without a doubt', 
    '🎱 **|** Better not tell you now', 
    '🎱 **|** My sources say no', 
    '🎱 **|** Yes definitely', 
    '🎱 **|** Cannot predict now', 
    '🎱 **|** Outlook not so good', 
    '🎱 **|** You may rely on it', 
    '🎱 **|** Concentrate and ask again', 
    '🎱 **|** Very doubtful', 
    '🎱 **|** As I see it, yes', 
    '🎱 **|** Most likely', 
    '🎱 **|** Outlook good', 
    '🎱 **|** Yes', 
    '🎱 **|** No', 
    '🎱 **|** Signs point to yes'
    ];    

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8-ball')
        .setDescription('Ask 8 ball a question')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question to ask')
                .setRequired(true)),
                        
    async execute(interaction) {
        const footer_message = require('../../config/footer');
        const question = interaction.options.getString('question');
        try {
            var get_response = answers[Math.floor(Math.random() * answers.length)];

        const embed = new EmbedBuilder()
            .setColor('#50a090')
            .setTitle(`\`🎱\` Ball Response`)
            .setDescription(`• **Question:**\n > \`${question}\`\n\n • **Response:**\n > ${get_response}`)
            .setTimestamp()
			.setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
            
        await interaction.reply({
            embeds: [embed]
        });

        } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('`❌` Error Getting 8 Ball Response')
            .setDescription(`Beemo has encountered an error while getting 8 Ball's response`)
            .setTimestamp()
        await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    }
};
