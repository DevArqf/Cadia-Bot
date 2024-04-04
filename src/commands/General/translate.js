const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
            defaultCooldown: 5,
			description: "Translate your message to a different language"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
            .setName('translate')
            .setDescription(this.description)
            .addStringOption(
                option => option
                    .setName('text')
                    .setDescription('Message Input')
                    .setRequired(true)
            )
            .addStringOption(
                option => option
                    .setName('from')
                    .setDescription('choose a language to translate from')
                    .setRequired(true)
                    .setChoices(
                        { name: 'Automatic', value: 'auto' },
                        { name: 'Arabic', value: 'ar' },
                        { name: 'Bengali', value: 'bn' },
                        { name: 'Chinese Simplified', value: 'zh-cn' },
                        { name: 'Danish', value: 'da' },
                        { name: 'Dutch', value: 'nl' },
                        { name: 'English', value: 'en' },
                        { name: 'Filipino', value: 'tl' },
                        { name: 'French', value: 'fr' },
                        { name: 'German', value: 'de' },
                        { name: 'Greek', value: 'el' },
                        { name: 'Hindi', value: 'hi' },
                        { name: 'Italian', value: 'it' },
                        { name: 'Japanese', value: 'ja' },
                        { name: 'Polish', value: 'pl' },
                        { name: 'Russian', value: 'ru' },
                        { name: 'Spanish', value: 'es' },
                        { name: 'Swedish', value: 'sv' },
                    )
            )
            .addStringOption(
                option => option
                    .setName('to')
                    .setDescription('choose a language to translate to')
                    .setRequired(true)
                    .setChoices(
                        { name: 'Automatic', value: 'auto' },
                        { name: 'Arabic', value: 'ar' },
                        { name: 'Bengali', value: 'bn' },
                        { name: 'Chinese Simplified', value: 'zh-cn' },
                        { name: 'Danish', value: 'da' },
                        { name: 'Dutch', value: 'nl' },
                        { name: 'English', value: 'en' },
                        { name: 'Filipino', value: 'tl' },
                        { name: 'French', value: 'fr' },
                        { name: 'German', value: 'de' },
                        { name: 'Greek', value: 'el' },
                        { name: 'Hindi', value: 'hi' },
                        { name: 'Italian', value: 'it' },
                        { name: 'Japanese', value: 'ja' },
                        { name: 'Polish', value: 'pl' },
                        { name: 'Russian', value: 'ru' },
                        { name: 'Spanish', value: 'es' },
                        { name: 'Swedish', value: 'sv' },
                    )),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        const msg = interaction.options.getString('text')
        const from = interaction.options.getString('from')
        const to = interaction.options.getString('to')
        const translated = await translate(msg, { from: from, to: to })

        const embed = new EmbedBuilder()
            .setColor(color.default)
            .setFields(
                { name: `${emojis.custom.pencil} \`-\` Inputted Text`, value: `${emojis.custom.replyend} **${msg}**` },
                { name: `${emojis.custom.globe} \`-\` Translated Text`, value: `${emojis.custom.replyend} **${translated.text}**` }
            )
            .setFooter({ text: `Translated for ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        interaction.reply({ embeds: [embed] })
    }
};

module.exports = {
	UserCommand
};
