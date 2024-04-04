const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const { Connect4 } = require("discord-gamecord");

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Play a game of connect four'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('connect-four')
				.setDescription(this.description)
                .addUserOption(option => 
                    option.setName('opponent')
                      .setDescription('Specified user will be your opponent')
                      .setRequired(true)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const enemy = interaction.options.getUser('opponent');
        if (interaction.user.id === enemy.id) 
            return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** play with yourself, are you lonely?`)], ephemeral: true });

        if (enemy.bot) 
            return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** play with a bot, do you not have friends?`)], ephemeral: true });

    const game = new Connect4({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser('opponent'),
      embed: {
        title: "> Connect Four Game",
        rejectTitle: "Cancelled Request",
        statusTitle: `\`⌛\` \`-\` Status`,
        overTitle: `\`⏰\` \`-\` Game Over`,
        color: `${color.default}`,
        rejectColor: `${color.default}`,
      },
      emojis: {
        board: `<:C4Holder:1225498863947874334>`,
        player1: "🔴",
        player2: "🟡",
      },
      mentionUser: true,
      timeoutTime: 120000,
      buttonStyle: "PRIMARY",
      turnMessage: "> {emoji} | **{player}**, it is your turn!",
      winMessage: `> ${emojis.custom.tada1} | **{player}** has won the Connect Four Game!`,
      tieMessage: "> The game turned out to be a tie!",
      timeoutMessage: "> The game went unfinished! no one won the game!",
      playerOnlyMessage: `${emojis.custom.forbidden} You cannot interact with these buttons. Only {player} and {opponent} can use these buttons!`,
      rejectMessage: "{opponent} denied your request for a round of Connect Four!",
    });

    try {
        await game.startGame();
      } catch (err) {
        console.log(err);
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
