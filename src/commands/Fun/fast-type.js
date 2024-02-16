const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder } = require('discord.js');
const footer_message = require('../../config/footer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fast-type')
        .setDescription('Starts a fast-type challenge'),

    async execute(interaction) {
        
        const sentences = [
            "Rex Quinfrey, a renowned scientist, created plans for an invisibility machine.",
            "Do you know why all those chemicals are so hazardous to the environment?",
            "Trixie and Veronica, our two cats, just love to play with their pink ball of yarn.",
            "We climbed to the top of the mountain in just under two hours; isn’t that great?",
            "In order to keep up at that pace, Zack Squeve would have to work all night.",
            "Beemo is my best friend. He's always there when I need him.",
            "Beemo was made on Jan, 26th, 2024"
        ];
        const selectedSentence = sentences[Math.floor(Math.random() * sentences.length)];


        const challengeEmbed = new EmbedBuilder()
            .setColor('#50a090') 
            .setTitle('`🌟` Fast-Type Challenge!')
            .setDescription('`⚡` **Are you ready to showcase your typing speed?**')
            .addFields({ 
                name: '`📜` Your Challenge:', 
                value: `> *"${selectedSentence}"*`
            })
            .setFooter({
                text: 'You have 15 seconds. Ready... Set... Go!', 
                iconURL: interaction.client.user.displayAvatarURL() 
            })
            .setTimestamp()
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQet4PCRsDDOgJtPIyIQDrNxy_qoJqL_Xh1jA&usqp=CAU')

        await interaction.reply({ embeds: [challengeEmbed] });

        const timeLimit = 15000; // 15 seconds

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: timeLimit });

        collector.on('collect', m => {
            if (m.content.toLowerCase() === selectedSentence.toLowerCase()) {
                const timeTaken = m.createdTimestamp - interaction.createdTimestamp;
                const successEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('`🎉` Congratulations! `🎉`')
                    .setDescription(`${m.author}, you completed the challenge in **${timeTaken/1000}s**!`)
                    .setFooter({
                        text: `${footer_message}`, 
                        iconURL: interaction.client.user.displayAvatarURL() 
                    })
                    .setTimestamp()
                interaction.editReply({ embeds: [successEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                const failureEmbed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('`⏰` Time Up! `⏰`')
                    .setDescription('You ran out of time! Better luck next time!')
                    .setFooter({
                        text: `${footer_message}`, 
                        iconURL: interaction.client.user.displayAvatarURL() 
                    })
                    .setTimestamp()
                interaction.editReply({ embeds: [failureEmbed] });
            }
        });
    },
};
