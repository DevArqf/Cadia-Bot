const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
            requiredUserPermissions: ['ManageWebhooks'],
			description: 'Impersonate someone within the server using webhook'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('impersonate')
				.setDescription(this.description)
                .addUserOption(option => option
                    .setName("user")
                    .setDescription("The user you want to impersonate")
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName("message")
                    .setDescription("The message you want the user to say")
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName("channel")
                    .setDescription("Sends this message to a specified channel")
                    .setRequired(true)
                    .addChannelTypes(ChannelType.GuildText)
                ),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

        const member = interaction.options.getUser("user");
        const message = interaction.options.getString("message");
        const channelx = interaction.options.getChannel("channel");

        // Permissions //
        //if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) return await interaction.reply({
        //    content: `${emojis.custom.forbidden} You are not **authorized** to *execute** this command!`
        // })
 
        if (message.includes('@everyone') || message.includes('@here')) return await interaction.reply({ 
            content: `${emojis.custom.forbidden} You **cannot** mention **everyone/here** with this command!`, 
            ephemeral: true
        });
 
        await channelx.createWebhook({
            name: member.username,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then((webhook) => {
            webhook.send({content: message});
            setTimeout(() => {
                webhook.delete();
            }, 3000)
        });
 
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} <@${member.id}> has been impersonated in <#${channelx.id}>`)],
            ephemeral: true
        });
    }
};

module.exports = {
	UserCommand
};
