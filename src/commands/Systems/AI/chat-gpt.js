const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const { EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require ('openai');
const mongoose = require ('mongoose');

const userConversationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    messages: [{ type: String }],
    response: { type: String }
});

const UserConversation = mongoose.model('UserConversation', userConversationSchema);

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Ask ChatGPT a question'
		});
	}

	/**Q
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('chatgpt')
				.setDescription(this.description)
                .addStringOption(option => option.setName('prompt').setDescription('The prompt for ChatGPT').setRequired(true)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction, message) {
		const configuration = new Configuration({
            apiKey: 'KEY HERE'
        });
        const openai = new OpenAIApi(configuration);

        const generating = new EmbedBuilder()
        generating.setDescription(`${emojis.custom.loading} | **Currently generating your response, this might take a while**`);
        generating.setColor(`${color.invis}`)

        await interaction.reply({ embeds: [generating], ephemeral: true });

        const { options } = interaction;
        const userId = interaction.user.id;
        const prompt = options.getString('prompt');

        try {
            let userConversation = await UserConversation.findOne({ userId }).exec();

            if (!userConversation) {
                userConversation = new UserConversation({ userId, messages: [] });
            }

            userConversation.messages.push(prompt);

            const result = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo-16k-0613',
                messages: userConversation.messages.map(msg => ({ role: 'user', content: msg }))
            });

            userConversation.response = result.data.choices[0].message.content;
            await userConversation.save();

            const response = new EmbedBuilder()
            response.setTitle(`${options.getString('prompt')}`)
            response.setAuthor({ name: `ChatGPT's Response` })
            response.setDescription(`\`\`\`${userConversation.response}\`\`\``)
            response.setColor(`${color.default}`)
            response.setTimestamp()
            response.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.followUp({ embeds: [response] });
        } catch (error) {
            console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} ChatGPT Command Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
        }
    }
};

module.exports = {
	UserCommand
};
