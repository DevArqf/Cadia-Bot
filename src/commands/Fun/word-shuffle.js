const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const footer_message = require('../../config/footer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word-shuffle')
        .setDescription('Guess the shuffled words Game!'),

    async execute(interaction) {
        const words = [
            'Abnegation',
            'abject',
            'alias',
            'blandishment',
            'beemo',
            'apple',
            'banana',
            'carrot',
            'dog',
            'elephant',
            'flower',
            'guitar',
            'house',
            'ice cream',
            'jacket',
            'kite',
            'lion',
            'monkey',
            'notebook',
            'orange',
            'penguin',
            'queen',
            'rabbit',
            'sun',
            'tree',
            'umbrella',
            'violin',
            'watermelon',
            'xylophone',
            'yacht',
            'zebra'
        ];
         
        const selectedWord = words[Math.floor(Math.random() * words.length)];
        const shuffledWord = shuffleWord(selectedWord);

     
        const startEmbed = new EmbedBuilder()
            .setColor('#50a090') 
            .setTitle('`🔠` Word Shuffle Game')
            .setDescription(`**Guess the word!**\n\nThe Shuffled Word: \`${shuffledWord}\`\n\n*You have **30 seconds** to guess! Type your guess in the chat.*`) 
            .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL () }); 

        await interaction.reply({ embeds: [startEmbed] });

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000, max: 1 });

        collector.on('collect', async m => {
            let resultEmbed = new EmbedBuilder();

            if (m.content.toLowerCase().trim() === selectedWord) {
                resultEmbed
                    .setColor('#00ff00') 
                    .setTitle('`🎉` Correct Answer! `🎉`')
                    .setDescription(`You guessed the word correctly!\n\nThe word was: \`${selectedWord}\``)
                    .setTimestamp()
                    .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL () });
            } else {
                resultEmbed
                    .setColor('#FF0000') 
                    .setTitle('`❌` Incorrect Answer')
                    .setDescription(`Oops, that's not right!\n\nThe correct word was: \`${selectedWord}\``)
                    .setTimestamp()
                    .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL () });
            }

            await interaction.followUp({ embeds: [resultEmbed] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor('#ff0000') 
                    .setTitle('`⏰` Time Up! `⏰`')
                    .setDescription('You ran out of time! Better luck next time!')
                    .setTimestamp()
                    .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL () });
                interaction.followUp({ embeds: [timeoutEmbed] });
            }
        });
    },
};

function shuffleWord(word) {
    const shuffled = word.split('').sort(() => 0.5 - Math.random()).join('');
    return shuffled;
}
