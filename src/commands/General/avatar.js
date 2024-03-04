const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Fetch a user's avatar from the server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
        registerApplicationCommands(registry) {
	    registry.registerChatInputCommand((builder) =>
	        builder //
	                .setName('avatar')
	                .setDescription(this.description)
                        .setDMPermission(false)
                        .addUserOption(option => option
                                .setName('user')
                                .setDescription(`The users avatar to fetch`)
                                .setRequired(false))
                        .addStringOption(option => option
                                .setName('id')
                                .setDescription(`If the user has left, you can enter the user ID`)
                                .setRequired(false)),
	        );
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

	const { client, member } = interaction;
        const userOption = interaction.options.getUser('user');
        const idOption = interaction.options.getString('id');

        let user;

        if (userOption) {
            user = userOption;

        } else if (idOption) {
            try {
                user = await client.users.fetch(idOption);
            } catch (error) {

                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(`${color.fail}`)
                    .setTitle(`${emojis.custom.fail} 8 Ball Error`)
                    .setDescription(`${emojis.custom.fail} I have encountered an error! Please make sure the provided ID is **valid**.`)
                    .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                return;
            }
            
        } else {
            user = member.user;
        }

        const userAvatar = user.displayAvatarURL({ size: 2048, dynamic: true });

        const embed = new EmbedBuilder()
            .setColor(`${color.default}`)
            .setAuthor({ name: `${user.username}'s Avatar`, iconURL: `${user.displayAvatarURL({ size: 64, dynamic: true })}`})
            .setImage(userAvatar)
            .setTimestamp()
            .setFooter({ text: `User ID: ${user.id}` });

        const png = new ButtonBuilder()
            .setLabel('PNG')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'png' }));

        const jpg = new ButtonBuilder()
            .setLabel('JPG')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'jpg' }));

        const jpeg = new ButtonBuilder()
            .setLabel('JPEG')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'jpeg' }));

        const gif = new ButtonBuilder()
            .setLabel('GIF')
            .setStyle(ButtonStyle.Link)
            .setURL(user.displayAvatarURL({ size: 2048, format: 'gif' }));

        const row = new ActionRowBuilder().addComponents(png, jpg, jpeg, gif);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [row],
        });
    }
};

module.exports = {
	UserCommand
};
