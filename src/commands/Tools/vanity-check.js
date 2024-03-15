const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Check to see if a vanity url is already taken or not"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('vanity-check')
				.setDescription(this.description)
                .addStringOption((option) => option
                    .setName('vanity')
                    .setDescription('The vanity to check')
                    .setRequired(true)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction, client) {
		const { options } = interaction;
        const vanity = options.getString('vanity');

        async function sendMessage(message, send) {
            const embed = new EmbedBuilder()
            .setColor(`${color.default}`)
            .setDescription(message);

            if (send) {
                await interaction.reply({ content: `discord.gg/${vanity}`, embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        var invite = await interaction.client.fetchInvite(vanity).catch(err => {});

        var nInviteMsg = `\`🔓\` The vanity invite \`${vanity}\` is **NOT** taken by a server!`;

        if (!invite) {
            await sendMessage(nInviteMsg);
        } else {
            if (!invite.guild || !invite.guild.vanityURLCode || invite.guild.vanityURLCode !== vanity)
            return await sendMessage(nInviteMsg);

            await sendMessage(`${emojis.custom.warning} Looks like the vanity \`${vanity}\` is taken by: \`discord.gg/${vanity}\` \n\n**${invite.guild.name}'s Server Features:** \n> \n **• Member Count:**\n ${emojis.custom.replyend} \`${invite.memberCount}\` \n**• Server ID:**\n ${emojis.custom.replyend} \`${invite.guild.id}\` \n**• Server Description:**\n ${emojis.custom.replyend} \`${invite.guild.description??`None`}\` \n\nThis server holds the invite \`${vanity}\` meaning it is **NOT** usable by anyone else.`, true);
        }
    }
}

module.exports = {
	UserCommand
};


