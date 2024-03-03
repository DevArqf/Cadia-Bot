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
        const userToUnban = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        // Permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        //    return await interaction.reply({ content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`, ephemeral: true });
        // }
        
        if (Number.isNaN(userToUnban)) {
            return await interaction.reply({ content: `${emojis.custom.fail} You have inputed something that is not a number!`, ephemeral: true });
        }
        
        const user = interaction.client.user.fetch(userToUnban);
        
        // Unban the user
        interaction.guild.bans.remove(userToUnban, reason)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor(`${color.success}`)   
                    .setTitle(`${emojis.reg.success} Unban Successful`)
                    .setDescription(`**${user.username}** has been **Unbanned**! \n\n**• Reason**\n ${emojis.custom.replyend} \`${reason}\``)
                    .setTimestamp()
                    .setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

                interaction.reply({ content: '', embeds: [embed] });
            })
            .catch(error => {
                console.error(error);
        	    const errorEmbed = new EmbedBuilder()
            	    .setColor(`${color.fail}`)
            	    .setTitle(`${emojis.custom.fail} Unban Command Error`)
            	    .setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	    .setTimestamp();

        	    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			    return;
            });
        
    }
};

module.exports = {
	UserCommand
};