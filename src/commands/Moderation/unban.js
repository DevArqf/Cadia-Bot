const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config')


class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
         requiredUserPermissions: ['BanMembers'],
			description: 'Unbans a user, allowing them to join the server again.'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('unban')
				.setDescription(this.description)
				.addStringOption(option => 
                    option.setName('user')
                        .setDescription('The user(id) to unban')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for unbanning the user')
                        .setRequired(true)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
        const userToUnban = interaction.options.getString('user');
        const reason = interaction.options.getString('reason');

        // Permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        //    return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You are not **authorized** to **execute** this command!`)], ephemeral: true });
        // }
        
        if (Number.isNaN(userToUnban)) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You have inputted something that is not a number!`)], ephemeral: true });
        }
        
        const user = await interaction.client.users.fetch(userToUnban);
        
        // Unban the user
        await interaction.guild.bans.remove( user.id )
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor(color.success)
                    .setDescription(`**${user.username}** has been **Unbanned**! \n\n**• Reason**\n ${emojis.custom.replyend} \`${reason}\``)
                    .setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                interaction.reply({ content: '', embeds: [embed] });
            })
            .catch(error => {
                console.error(error);
        	    const errorEmbed = new EmbedBuilder()
            	    .setColor(color.fail)
            	    .setDescription(`${emojis.custom.fail} **Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.**\n\n > ${emojis.custom.link} \`-\` *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
            	    .setTimestamp();

        	    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            });   
    }
};

module.exports = {
	UserCommand
};