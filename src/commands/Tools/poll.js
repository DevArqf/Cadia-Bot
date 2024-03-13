const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Create a poll in your channel'
        });
        
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('poll')
                .setDescription(this.description)
                .addStringOption((option) => 
                    option.setName('topic').setDescription('The topic of your poll').setRequired(true)
                )
                .addStringOption((option) => 
                    option.setName('option1').setDescription('The first option for your poll').setRequired(true)
                )
                .addStringOption((option) => 
                    option.setName('option2').setDescription('The second option for your poll').setRequired(true)
                ) 
        );
    }

    async chatInputRun(interaction) {
        const topic = interaction.options.getString('topic');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');

        const choices = [
            { name: option1, emoji: '1️⃣' }, 
            { name: option2, emoji: '2️⃣' }
        ];

        const embed = new EmbedBuilder()
            .setColor(`${color.default}`)
            .setTitle(topic)
            .setDescription(`• **Options:**\n${choices.map((choice, index) => `${choice.emoji} ${choice.name}`).join('\n')}`);

        

const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });

choices.forEach(choice => {
    pollMessage.react(choice.emoji)
        .catch(error => console.error(`Failed to react with ${choice.emoji}`, error));     
});

    }
}

module.exports = {
	UserCommand
};