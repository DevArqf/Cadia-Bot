const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config');


class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
            requiredUserPermissions: ['BanMembers'],
			description: 'Ban a user from the server, revoking access for them to join again.'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('ban')
				.setDescription(this.description)
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user to ban')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('userid')
                        .setDescription('The ID of the user to ban')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for banning the user')
                        .setRequired(false))
                .addAttachmentOption(option =>
                    option.setName('evidence')
                        .setDescription('Attach a evidence related to the ban')
                        .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const evidence = interaction.options.getAttachment('evidence') || 'No evidence provided';
        const userid = interaction.options.getString('userid');
        const userToBan = interaction.options.getUser('user');

        // Permissions
		// if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
		// 	return await interaction.reply({
		// 		content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`,
		// 		ephemeral: true
		// 	});
		// }

        if (userid) {
            try {

            if (Number.isNaN(userid)) {
                return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You have entered something that is not a **number**. Please make sure you are entering a **valid** User ID!`)], ephemeral: true });
            }
            if (interaction.member.id === userid) {
                return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** ban yourself!`)], ephemeral: true});
            }

            const user = await interaction.client.users.fetch(userid);

            if (!user) {
                return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You have entered an **Invalid** user ID. Please make sure the User ID is **valid**!`)], ephemeral: true });
            } else {

                const banConfirmationEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setDescription(`${emojis.custom.info} \`-\` **${user.tag}** has been **banned**!`)
                .addFields(
                    {
                        name: `${emojis.custom.mail} \`-\` **Reason:**`,
                        value: `${emojis.custom.replyend} **${reason}**`,
                        inline: false
                    },
                    {
                        name: `${emojis.custom.person} \`-\` **Moderator:**`,
                        value: `${emojis.custom.replyend} **${interaction.user.displayName}**`,
                        inline: false
                    }
                )
                .setFooter({ text: `User Banned: ${userid}` })
                .setTimestamp();

                await interaction.guild.members.ban(user, { reason: `${userid}: ${reason}` })
                return await interaction.reply({ content: '', embeds: [banConfirmationEmbed] });
                
            }

            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(color.fail)
                    .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                    .setTimestamp();
    
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            };
            return;
        }

        const banMember = await interaction.guild.members.fetch(userToBan.id);

        // Permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            //    return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.foridden} You are not **authorized** to **execute** this command!`)], ephemeral: true});
            // }
            
            if (!banMember) {
                return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} The **user** mentioned is no longer within the **server**!`)], ephemeral: true});
            }

            if (banMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.forbidden} You **cannot** ban **staff** members or people with the **Administrator** permission!`)], ephemeral: true});
            }

        if (!banMember.kickable) {
            return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.forbidden} I **cannot** ban this user because they are either **higher** than me or you!`)], ephemeral: true});
        }

        if (interaction.member.id === banMember.id) {
            return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** ban yourself!`)], ephemeral: true});
        }

        // DM Message
        try {
            const dmEmbed = new EmbedBuilder()
                .setColor(color.fail)
                .setDescription(`${emojis.custom.info} \`-\` You have been **banned** from **${interaction.guild.name}**`)
                .addFields(
                    {
                        name: `${emojis.custom.mail} \`-\` **Reason:**`,
                        value: `${emojis.custom.replyend} **${reason}**`,
                        inline: false
                    },
                    {
                        name: `${emojis.custom.person} \`-\` **Moderator:**`,
                        value: `${emojis.custom.replyend} **${interaction.user.displayName}**`,
                        inline: false
                    }
                )
                .setThumbnail(interaction.guild.iconURL())
                .setFooter({ text: `You have been banned` })
                .setTimestamp();
            
            if (!evidence) {
                dmEmbed.addFields({ name: `${emojis.custom.save} \`-\` Evidence:`, value: `${emojis.custom.replyend} No evidence provided` });
            }
            
            if (evidence) {
                dmEmbed.setImage(evidence.url);
                dmEmbed.addFields({ name: `${emojis.custom.save} \`-\` Evidence:`, value: `${emojis.custom.replyend} \`👇\` Image below \`👇\`` });
            }

            await userToBan.send({ embeds: [dmEmbed] }).catch(error => console.error(`I **cannot** send a Direct Message to ${userToBan.tag}.`, error));

            const banConfirmationEmbed = new EmbedBuilder()
                .setColor(color.success)
                .setDescription(`${emojis.custom.info} \`-\` **${userToBan.tag}** has been **banned**!`)
                .addFields(
                    {
                        name: `${emojis.custom.mail} \`-\` **Reason:**`,
                        value: `${emojis.custom.replyend} **${reason}**`,
                        inline: false
                    },
                    {
                        name: `${emojis.custom.person} \`-\` **Moderator:**`,
                        value: `${emojis.custom.replyend} **${interaction.user.displayName}**`,
                        inline: false
                    }
                )
                .setFooter({ text: `User Banned: ${userToBan.id}` })
                .setTimestamp();

                await interaction.guild.members.ban(userToBan, { reason: `${userid}: ${reason}` });
                await interaction.reply({ content: '', embeds: [banConfirmationEmbed] });
        } catch (error) {
            console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(color.fail)
            	.setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
        }
    }
};


module.exports = {
	UserCommand
};
