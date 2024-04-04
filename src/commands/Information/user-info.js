const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Receive information of a user within the server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('user-info')
				.setDescription(this.description)
                .addUserOption((option) => option
                    .setName('user')
                    .setDescription('The user you want to view information of')
                    .setRequired(true))
				.addStringOption((option) => option
                    .setName('id')
                    .setDescription(`If the user has left, you can enter the user ID`)
                    .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const { member } = interaction;
		const userOption = interaction.options.getUser('user') || interaction.user;
        const idOption = interaction.options.getString('id');
        const tag = userOption.tag;

        let user;

        if (userOption) {
            user = userOption;

        } else if (idOption) {
            try {
                user = await client.users.fetch(idOption);
            } catch (error) {

                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(color.fail)
                    .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                return;
            }

		} else {
            user = member.user;
        }

        const userAvatar = user.displayAvatarURL({ size: 2048, dynamic: true });

        const embed = new EmbedBuilder()
        .setColor(color.default)
        .setAuthor({ name: tag, iconURL: userAvatar })
        .setThumbnail(userAvatar)
        .addFields(
            { name: `${emojis.custom.person} \`-\` **Member:**`, value: `${emojis.custom.replyend} ${userOption}`, inline: false},
            { name: `${emojis.custom.community} \`-\` **Roles:**`, value: `${member.roles.cache.map(r => r).join(' ')}`, inline: false},
            { name: `${emojis.custom.clock} \`-\` **Joined Server:**`, value: `${emojis.custom.replyend} <t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true},
            { name: `${emojis.custom.calendar} \`-\` **Joined Discord:**`, value: `${emojis.custom.replyend} <t:${parseInt(user.createdAt / 1000)}:R>`, inline: true}
        )
        .setFooter({ text: `User ID: ${userOption.id}` })
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
}

module.exports = {
	UserCommand
};
