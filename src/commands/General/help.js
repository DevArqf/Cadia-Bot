const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const footer_message = require("../../config/footer");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Provides a list of Beemo's commands"),
	async execute(interaction) {
		const centerEmbed = new EmbedBuilder()
			.setColor("#50a090")
			.setTimestamp()
			.setAuthor({ name: "🧰 Beemo's Front Desk" })
			.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(interaction.client.user.displayAvatarURL())
			.addFields(
				{ name: "• Beemo's Front Desk", value: "> Displays this menu." },
				{ name: "• General Commands", value: "> Displays all of the General Commands." },
				{ name: "• Moderation Commands", value: "> Displays all of the Moderation Commands." },
				{ name: "• Fun Commands", value: "> Displays all of the Fun Commands." },
				{ name: "• Utility Commands", value: "> Displays all of the Utility Commands." },
			 	{ name: "• Economy Commands", value: "> Displays all of the Economy Commands." },
			)
		const selectMenu = new StringSelectMenuBuilder()
			.setMinValues(1)
				.setMaxValues(1)
				.setCustomId("selecthelp")
				.setPlaceholder("• Select a menu")
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel("• Beemo's Front Desk")
						.setValue("helpcenter"),
					new StringSelectMenuOptionBuilder()
						.setLabel("• General Commands")
						.setValue("gcommands"),
					new StringSelectMenuOptionBuilder()
						.setLabel("• Moderation Commands")
						.setValue("mcommands"),
					new StringSelectMenuOptionBuilder()
						.setLabel("• Fun Commands")
						.setValue("fcommands"),
					new StringSelectMenuOptionBuilder()
						.setLabel("• Utility Commands")
						.setValue("ucommands"),
					new StringSelectMenuOptionBuilder()
						.setLabel("• Economy Commands")
						.setValue("ecommands"),
					)
		
		const helpRow = new ActionRowBuilder()
			.addComponents(selectMenu)
			
			const menu = await interaction.reply({ embeds: [centerEmbed], components: [helpRow], fetchReply: true });
			
			const buttons = new ActionRowBuilder();
			
			const selectMenuCollector = menu.createMessageComponentCollector({
				filter: (i) => i.customId === "selecthelp",
				componentType: ComponentType.StringSelect,
				time: 60000,
			});
			
			selectMenuCollector.on("collect", async (i) => {
				if (i.user.id === interaction.user.id) {
					const selectedOption = i.values[0];
					
					switch (selectedOption) {
						case "helpcenter":
							const helpCenterEmbed = new EmbedBuilder()
								.setColor("#50a090")
								.setTitle("`🧰` Beemo's Front Desk")
								.setDescription("Navigate through Beemo's Front Desk.")
								.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
								.setThumbnail(interaction.client.user.displayAvatarURL())
								.addFields(
									{ name: "Beemo's Front Desk", value: "> Displays this menu." }
								)
							
							selectMenu.setDisabled(true);
				            await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
							await i.reply({ embeds: [helpCenterEmbed] });
							break;
						case "gcommands":
							const generalCommandsEmbed = new EmbedBuilder()
								.setColor("#50a090")
								.setTitle("`🌎` General Commands")
								.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
								.setThumbnail(interaction.client.user.displayAvatarURL())
								.addFields(
									{ name: "/help", value: "> Opens up Beemo's help guide!"},
									{ name: "/generate-command", value: "> Generates code for your Discord Bot!" },
									{ name: "/server-info", value: "> Get Information of the server." }
								)
							
							buttons.addComponents(
								new ButtonBuilder()
									.setCustomId("pageRight")
									.setLabel("▶")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("helpCenter")
									.setLabel("Help Center")
									.setStyle(ButtonStyle.Secondary)
							);
							
							selectMenu.setDisabled(true);
				            await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
							await i.reply({ embeds: [generalCommandsEmbed], components: [buttons] });
							break;
						case "mcommands":
							const moderationCommandsEmbed = new EmbedBuilder()
								.setColor("#50a090")
								.setTitle("`⚒️` Moderation Commands")
								.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
								.setThumbnail(interaction.client.user.displayAvatarURL())
								.addFields(
									{ name: "/ban", value: "> Ban a user from the server." },
									{ name: "/unban", value: "> Unbans a user, allowing them to join the server again." },
									{ name: "/kick", value: "> Kick a user from the server." },
									{ name: "/mute", value: "> Mute a user within the server, revoking their permission to speak." },
									{ name: "/unmute", value: "> Unmute a user within the server, allowing them to speak again." },
									{ name: "/purge", value: "> Bulk deletes given amount of messages. Limit is 100." },
								)
							
							buttons.addComponents(
								new ButtonBuilder()
									.setCustomId("pageLeft")
									.setLabel("◀")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("pageRight")
									.setLabel("▶")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("helpCenter")
									.setLabel("Help Center")
									.setStyle(ButtonStyle.Secondary)
							);
							
							selectMenu.setDisabled(true);
				            await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
							await i.reply({ embeds: [moderationCommandsEmbed], components: [buttons] });
							break;
						case "fcommands":
							const funCommandsEmbed = new EmbedBuilder()
								.setColor("#50a090")
								.setTitle("`🎲` Fun Commands")
								.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
								.setThumbnail(interaction.client.user.displayAvatarURL())
								.addFields(
									{ name: "/8ball", value: "> Ask 8 ball a question." },
									{ name: "/ascii-art", value: "> Create beautiful Ascii Arts." },
									{ name: "/fast-type", value: "> Starts a fast-type challenge." },
									{ name: "/rps", value: "> Play a game of rock, paper, scissors!" },
									{ name: "/word-shuffle", value: "> Guess the shuffled words Game!" },
									{ name: "/interact", value: "> Setup a feedback system in your server!" }
								)
							
							buttons.addComponents(
								new ButtonBuilder()
									.setCustomId("pageLeft")
									.setLabel("◀")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("pageRight")
									.setLabel("▶")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("helpCenter")
									.setLabel("Help Center")
									.setStyle(ButtonStyle.Secondary)
							);
							
							selectMenu.setDisabled(true);
				            await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
							await i.reply({ embeds: [funCommandsEmbed], components: [buttons] });
							break;
						case "ucommands":
							const utilityCommandsEmbed = new EmbedBuilder()
								.setColor("#50a090")
								.setTitle("`🔧` Utility Commands")
								.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
								.setThumbnail(interaction.client.user.displayAvatarURL())
								.addFields(
									{ name: "/embed-creator", value: "> Create your own embed message." },
									{ name: "/feedback", value: "> Setup a feedback system in your server!" }
								)
							
							buttons.addComponents(
								new ButtonBuilder()
									.setCustomId("pageLeft")
									.setLabel("◀")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("pageRight")
									.setLabel("▶")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("helpCenter")
									.setLabel("Help Center")
									.setStyle(ButtonStyle.Secondary)
							);
							
							selectMenu.setDisabled(true);
				            await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
							await i.reply({ embeds: [utilityCommandsEmbed], components: [buttons] });
							break;
						case "ecommands":
							const economyCommandsEmbed = new EmbedBuilder()
							.setColor("#50a090")
							.setTitle("`💰` Economy Commands")
							.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
							.setThumbnail(interaction.client.user.displayAvatarURL())
							.addFields(
								{ name: "N/A", value: "> N/A" }
							)

							buttons.addComponents(
								new ButtonBuilder()
									.setCustomId("pageLeft")
									.setLabel("◀")
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId("helpCenter")
									.setLabel("Help Center")
									.setStyle(ButtonStyle.Secondary)
							);
							
							selectMenu.setDisabled(true);
				            await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
							await i.reply({ embeds: [economyCommandsEmbed], components: [buttons] });
							break;
					};
				} else {
					i.reply({ content: "<:bl_x_mark:1206436599794241576> **• These buttons are not yours!**", ephemeral: true });
				};
			});
			
			selectMenuCollector.on("end", async (collected) => {
				selectMenu.setDisabled(true);
				await menu.edit({ embeds: [centerEmbed], components: [helpRow] });
			});
	},
};