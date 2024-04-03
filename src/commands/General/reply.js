const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
            requiredUserPermissions: ['ManageMessages'],
			description: "Reply to a message from another user"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
            .setName("reply")
            .setDescription(this.description)
            .addStringOption(option => option
                .setName("message-id")
                .setDescription("The message ID of the user")
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName("text")
                .setDescription("Your reply message")
                .setRequired(true)
            )
            .addBooleanOption(option => option
                .setName("embed")
                .setDescription("Would you want your reply embedded or not?")
                .setRequired(true)
            ),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const msgid = interaction.options.getString("message-id");
        const content = interaction.options.getString("text");
        const boolean = interaction.options.getBoolean("embed")

        const embed1 = new EmbedBuilder()
        .setDescription(`${content}`)
        .setColor(color.default)

        if (msgid.startsWith("http")) {
            return await interaction.reply({
               content: `${emojis.custom.fail} You can **only** use the **message ID**. To **get** the **message ID**, enable the **Discord Developer Mode** in your **Accessibility** settings!`,
               ephemeral: true
            })
        }

        await interaction.reply({
            content: `${emojis.custom.success} I have **successfully** answered to https://ptb.discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msgid} **|** Content: ${content} **|** Embed: ${boolean}`,
            ephemeral: true
        })

        if (boolean) {
            await interaction.client.channels.cache.get(interaction.channel.id).messages.fetch(msgid).then(message => message.reply({embeds: [embed1]}))
        } else {  
            await interaction.client.channels.cache.get(interaction.channel.id).messages.fetch(msgid).then(message => message.reply({content: `${content}`}))
        }
    }
}

module.exports = {
	UserCommand
};
