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
			description: "Get a list of all existing commands of Cadia"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('help')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.warning} This feature is coming **very** soon. This command is currently in progress and **may** take some time!`)], ephemeral: true });
	}
}

module.exports = {
	UserCommand
};

// Rough Idea of How the code should look like //
/*


const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { helpEmojis, urls } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(`Displays a list of all available commands along with their usage.`),
  async execute(interaction) {
    const { staffEmojiId, infoEmojiId, loggingEmojiId, welcomeEmojiId, funEmojiId, debugEmojiId } = helpEmojis;
    const { botInviteLink, discordInviteLink, topgg, website, github } = urls;
    let color = getRoleColor(interaction.guild);
    let debugCmds = '';
    let funCmds = '';
    let infoCmds = '';
    let roleCmds = '';
    let staffCmds = '';
    let welcomeCmds = '';
    fs.readdirSync('./Commands/Debug').forEach((file) => {
      debugCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Fun').forEach((file) => {
      funCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Info').forEach((file) => {
      infoCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Roles').forEach((file) => {
      roleCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Moderation').forEach((file) => {
      staffCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Welcome').forEach((file) => {
      welcomeCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });

    const helpEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle('Commands')
      .addFields(
        {
          name: `${interaction.client.emojis.cache.get(staffEmojiId).toString()} Staff Commands`,
          value: `${'```' + staffCmds + '```'}`, inline: true
        },
        {
          name: `${interaction.client.emojis.cache.get(infoEmojiId).toString()} Info Commands`,
          value: `${'```' + infoCmds + '```'}`, inline: true
        },
        {
          name: `${interaction.client.emojis.cache.get(loggingEmojiId).toString()} Role Commands`,
          value: `${'```' + roleCmds + '```'}`, inline: true
        },
        {
          name: `${interaction.client.emojis.cache.get(welcomeEmojiId).toString()} Welcome Comamnds`,
          value: `${'```' + welcomeCmds + '```'}`, inline: true
        },
        {
          name: `${interaction.client.emojis.cache.get(funEmojiId).toString()} Fun Commands`,
          value: `${'```' + funCmds + '```'}`, inline: true
        },
        {
          name: `${interaction.client.emojis.cache.get(debugEmojiId).toString()} Debug Commands`,
          value: `${'```' + debugCmds + '```'}`, inline: true
        }
      )
      .setTimestamp();
    const links = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Add me')
        .setURL(botInviteLink)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Support')
        .setURL(discordInviteLink)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Vote!')
        .setURL(topgg)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Website')
        .setURL(website)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Code')
        .setURL(github)
        .setStyle('LINK')
    );
    interaction.reply({ embeds: [helpEmbed], components: [links] });
  }
}


*/