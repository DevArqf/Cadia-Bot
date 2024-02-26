const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder } = require('discord.js');

const answers = [
    '`🎱` **|** It is certain', 
    '`🎱` **|** Reply hazy, try again', 
    '`🎱` **|** Don’t count on it', 
    '`🎱` **|** It is decidedly so', 
    '`🎱` **|** Ask again later', 
    '`🎱` **|** My reply is no', 
    '`🎱` **|** Without a doubt', 
    '`🎱` **|** Better not tell you now', 
    '`🎱` **|** My sources say no', 
    '`🎱` **|** Yes definitely', 
    '`🎱` **|** Cannot predict now', 
    '`🎱` **|** Outlook not so good', 
    '`🎱` **|** You may rely on it', 
    '`🎱` **|** Concentrate and ask again', 
    '`🎱` **|** Very doubtful', 
    '`🎱` **|** As I see it, yes', 
    '`🎱` **|** Most likely', 
    '`🎱` **|** Outlook good', 
    '`🎱` **|** Yes', 
    '`🎱` **|** No', 
    '`🎱` **|** Signs point to yes'
    ];

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Ask 8 Ball a question'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('8ball')
				.setDescription(this.description)
                .addStringOption(option =>
                    option.setName('question')
                        .setDescription('The question to ask')
                        .setRequired(true))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

        const question = interaction.options.getString('question');

        try {
            var get_response = answers[Math.floor(Math.random() * answers.length)];
        
        const embed = new EmbedBuilder()
            .setColor(`${color.default}`)
            .setTitle(`\`🎱\` Ball Response`)
            .setDescription(`• **Question:**\n > \`${question}\`\n\n • **Response:**\n > ${get_response}`)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            
        await interaction.reply({
            embeds: [embed]
        });

        } catch (error) {
        console.error(error);
        const errEmbed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`${emojis.reg.fail} Error Getting 8 Ball Response`)
            .setDescription(`${emojis.custom.fail} I have **encountered** an **error** while getting 8 Ball's response`)
            .setTimestamp()
        await interaction.reply({ content: '', embeds: [errEmbed] });
            }
        }
    };

module.exports = {
	UserCommand
};
