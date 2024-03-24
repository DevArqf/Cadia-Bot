const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			permissionLevel: PermissionLevels.Developer,
			description: 'Vote for Cadia on Top.gg (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('vote')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
        const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDA0NzUxMTAyMzUxOTc2MzEiLCJib3QiOnRydWUsImlhdCI6MTcxMDk3NDk5OH0.hq1lxyZqvSXf2CUULuX26ni6DuJbyNQFi81FtFZsZc0";
        const botId = "1200475110235197631";
        const userId = interaction.user.id;

        try {
            const response = await fetch (`https://top.gg/api/bots/${botId}/check?userId=${userId}`, 
            { headers: {
                Authorization: apiKey,
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.voted === 1) {
                return interaction.reply(`${emojis.custom.fail} You have **already** voted for Cadia. We **appreciate** you trying again!`)
            } else if (data.voted === 0){
                const voteEmbed = new EmbedBuilder()
                    .setColor(`${color.default}`)
                    .setDescription(`${emojis.custom.heart2} It appears you're interested in **voting** for Cadia. To **cast** your vote, simply **click** the button **below** at your convenience!`)
                    .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

					const voteButton1 = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setLabel('Top.gg')
								.setURL(`https://top.gg/bot/1200475110235197631`)
								.setStyle(ButtonStyle.Link)
						)

						.addComponents(
							new ButtonBuilder()
								.setLabel('DiscordBotList.com')
								.setURL(`https://discordbotlist.com/bots/cadia`)
								.setStyle(ButtonStyle.Link)
						)

						.addComponents(
							new ButtonBuilder()
								.setLabel('DiscordList.gg')
								.setURL(`https://discordlist.gg/bot/1200475110235197631?message=success`)
								.setStyle(ButtonStyle.Link)
						)
						
                    return interaction.reply({ embeds: [voteEmbed], components: [voteButton1] })
            }
        } else {
            return interaction.reply(`**I have encountered an error! Please try again later.**`)
        }

        } catch (error) {
            return interaction.reply(`**I have encountered an error! Please try again later.**`)
        }
	}
};

module.exports = {
	UserCommand
};
