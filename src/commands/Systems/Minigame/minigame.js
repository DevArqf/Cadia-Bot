const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { TwoZeroFourEight } = require("discord-gamecord");
const { FindEmoji  } = require("discord-gamecord");
const { Connect4 } = require("discord-gamecord");
const { Flood } = require('discord-gamecord');
const { GuessThePokemon } = require('discord-gamecord');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Cadia\'s list of minigames'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('minigame')
				.setDescription(this.description)
                .addSubcommand(command =>
                    command.setName('find-emoji')
                    .setDescription('Play a game of Find Emoji. TIP: Have good memory...'))
                .addSubcommand(command => 
                    command.setName('2048')
                    .setDescription('Play a game of 2048. TIP: Just know how to count ;)'))
                .addSubcommand(command => 
                    command.setName('connect-four')
                    .setDescription(`Play a game of Connect Four. TIP: Strategy is key!`)
                    .addUserOption(option => 
                        option.setName('opponent')
                          .setDescription('Specified user will be your opponent')
                          .setRequired(true)))
                .addSubcommand(command =>
                    command.setName(`flood`)
                    .setDescription(`Play a game of Flood. TIP: Select the color you see the most ;)`))
                .addSubcommand(command =>
                    command.setName(`guess-the-pokemon`)
                    .setDescription(`Play a game of Guess The Pokemon. TIP: Watch Pokemon ;)`))
                .addSubcommand(command => 
                    command.setName('fast-type')
                    .setDescription('Play a game of Fast-Type. TIP: Just know how to type fast..'))
                .addSubcommand(command =>
                    command.setName('word-shuffle')
                    .setDescription('Play a game of Word Shuffle. TIP: Read a LOT of books!'))
                .addSubcommand(command => 
                    command.setName('gunfight')
                    .setDescription('Play a game of Cowboy. TIP: Make sure you was born from the WEST Side!')
                    .addUserOption(option => 
                        option.setName('player')
                        .setDescription('Select a player to challenge')
                        .setRequired(true)))
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {
            const { options } = interaction;
            const sub = options.getSubcommand();

            switch (sub) {
                case 'find-emoji':
                    const game1 = new FindEmoji({
                        message: interaction,
                        isSlashGame: true,
                        embed: {
                          title: '> Cadia Minigame - Find Emoji',
                          color: `${color.default}`,
                          description: 'Remember the emojis from the board below',
                          findDescription: `Find the {emoji} emoji before the time runs out`
                        },
                        timeoutTime: 60000,
                        hideEmojiTime: 5000,
                        buttonStyle: 'PRIMARY',
                        emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
                        winMessage: `> ${emojis.custom.tada1} **You Won!** You selected the correct emoji. {emoji}`,
                        loseMessage: `> ${emojis.custom.fail} **You lost!** You selected the wrong emoji. {emoji}`,
                        timeoutMessage: `> ${emojis.custom.fail} The game went unfinished!`,
                        playerOnlyMessage: `${emojis.custom.forbidden} You **cannot** interact with these buttons. Only {player} can use these buttons!`
                      });
                      
                      try {
                          await game1.startGame();
                        } catch (err) {
                          console.log(err);
                          const errorEmbed = new EmbedBuilder()
                            .setColor(color.fail)
                            .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                            .setTimestamp();
            
                        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                        return;
                        }

                        break;

                    case '2048':
                        const game2 = new TwoZeroFourEight({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                              title: "> Cadia Minigame - 2048",
                              color: `${color.default}`,
                            },
                            emojis: {
                              up: "⬆️",
                              down: "⬇️",
                              left: "⬅️",
                              right: "➡️",
                            },
                            timeoutTime: 60000,
                            buttonStyle: "PRIMARY",
                            timeoutMessage: `> ${emojis.custom.fail} The game went **unfinished**!`,
                            playerOnlyMessage: `${emojis.custom.forbidden} You **cannot** interact with these buttons. Only {player} can use these buttons!`,
                          });
                      
                          try {
                              await game2.startGame();
                            } catch (err) {
                              console.log(err);
                              const errorEmbed = new EmbedBuilder()
                                .setColor(color.fail)
                                .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                                .setTimestamp();
                
                                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                return;
                            }

                            break;
                        
                        case 'connect-four':
                            const enemy = interaction.options.getUser('opponent');

                            if (interaction.user.id === enemy.id) 
                                return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** play with yourself, are you lonely?`)], ephemeral: true });

                            if (enemy.bot) 
                                return await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** play with a bot, do you not have friends?`)], ephemeral: true });

                            const game3 = new Connect4({
                                message: interaction,
                                isSlashGame: true,
                                opponent: interaction.options.getUser('opponent'),
                                embed: {
                                title: "> Cadia Minigame - Connect Four",
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
                        winMessage: `> ${emojis.custom.tada1} **{player}** has **won** the Connect Four Game!`,
                        tieMessage: "> The game turned out to be a tie!",
                        timeoutMessage: "> The game went **unfinished**! no one won the game!",
                        playerOnlyMessage: `${emojis.custom.forbidden} You **cannot** interact with these buttons. Only {player} and {opponent} can use these buttons!`,
                        rejectMessage: "{opponent} **denied** your request for a round of Connect Four!",
                    });

                        try {
                            await game3.startGame();
                        } catch (err) {
                            console.log(err);
                            const errorEmbed = new EmbedBuilder()
                                .setColor(color.fail)
                                .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                                .setTimestamp();

                            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		                    return;
                        }

                        break;
                    
                    case 'flood':
                        const game4 = new Flood({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                              title: '> Cadia Minigame - Flood',
                              color: `${color.default}`,
                            },
                            difficulty: 8,
                            timeoutTime: 60000,
                            buttonStyle: 'PRIMARY',
                            emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
                            winMessage: `> ${emojis.custom.tada1} **You won!** You took **{turns}** turns.`,
                            loseMessage: `> ${emojis.custom.fail} **You lost!** You took **{turns}** turns.`,
                            timeoutMessage: `> ${emojis.custom.fail} The game went **unfinished**.`,
                            playerOnlyMessage: `${emojis.custom.forbidden} You **cannot** interact with these buttons. Only {player} can use these buttons!`
                          });
                          
                            try {
                                await game4.startGame();
                            } catch (err) {
                                console.log(err);
                                const errorEmbed = new EmbedBuilder()
                                    .setColor(color.fail)
                                    .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                                    .setTimestamp();
    
                                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                return;
                            }

                        break;
                        
                    case 'guess-the-pokemon':
                        const game5 = new GuessThePokemon({
                            message: interaction,
                            isSlashGame: true,
                            embed: {
                                title: `> Cadia Minigame - Who's The Pokemon`,
                                color: `${color.default}`
                            },
                            timeoutTime: 60000,
                            winMessage: `> ${emojis.custom.tada1} **You guessed it right!** it was {pokemon}.`,
                            loseMessage: `> ${emojis.custom.fail} Better luck next time! It was a {pokemon}.`,
                            errMessage: `${emojis.custom.fail} **Unable** to fetch pokemon data. Please try again later!`,
                            timeoutMessage: `> ${emojis.custom.fail} The game went **unfinished**.`,
                            playerOnlyMessage: `${emojis.custom.forbidden} You **cannot** interact with these buttons. Only {player} can use these buttons!`
                        });
                              
                              try {
                                  await game5.startGame();
                                } catch (err) {
                                  console.log(err);
                                  const errorEmbed = new EmbedBuilder()
                                        .setColor(color.fail)
                                        .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                                        .setTimestamp();
    
                                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                return;
                                }

                            break;

                        case 'fast-type':
                            const sentences = [
                                'Rex Quinfrey, a renowned scientist, created plans for an invisibility machine.',
                                'Do you know why all those chemicals are so hazardous to the environment?',
                                'Trixie and Veronica, our two cats, just love to play with their pink ball of yarn.',
                                'We climbed to the top of the mountain in just under two hours; isn’t that great?',
                                'In order to keep up at that pace, Zack Squeve would have to work all night.',
                                "Cadia Bot is my best friend. He's always there when I need him.",
                                'Cadia Bot was created on Jan, 26th, 2024 by Malik.'
                            ];
                            const selectedSentence = sentences[Math.floor(Math.random() * sentences.length)];
                    
                            const challengeEmbed = new EmbedBuilder()
                                .setColor(color.default)
                                .setTitle('`🌟` Fast-Type Challenge!')
                                .setDescription('`⚡` **Are you ready to showcase your typing speed?**')
                                .addFields({
                                    name: '`📜` Your Challenge:',
                                    value: `${emojis.custom.replyend} *"${selectedSentence}"*`
                                })
                                .setFooter({
                                    text: 'You have 15 seconds. Ready... Set... Go!',
                                    iconURL: interaction.user.displayAvatarURL()
                                })
                                .setTimestamp();
                    
                            await interaction.reply({ embeds: [challengeEmbed] });
                    
                            const timeLimit = 15000; // 15 seconds
                    
                            const filter1 = (m) => m.author.id === interaction.user.id;
                            const collector1 = interaction.channel.createMessageCollector({ filter1, time: timeLimit });
                    
                            collector1.on('collect', (m) => {
                                if (m.content.toLowerCase() === selectedSentence.toLowerCase()) {
                                    const timeTaken = m.createdTimestamp - interaction.createdTimestamp;
                                    const successEmbed = new EmbedBuilder()
                                        .setColor(color.default)
                                        .setTitle(`> Congratulations, You Won! ${emojis.custom.tada2}`)
                                        .setDescription(`${m.author}, you completed the challenge in **${timeTaken / 1000}s**!`)
                                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                                        .setTimestamp();
                    
                                    interaction.editReply({ embeds: [successEmbed] });
                                    collector1.stop();
                                }
                            });
                    
                            collector1.on('end', (collected) => {
                                if (collected.size === 0) {
                                    const failEmbed = new EmbedBuilder()
                                        .setColor(color.fail)
                                        .setTitle('`⏰` Times Up!')
                                        .setDescription(`${emojis.custom.clock} You ran out of time! Better luck next time!`)
                                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                                        .setTimestamp();
                    
                                    interaction.editReply({ embeds: [failEmbed] });
                                }
                            });

                            break;

                        case 'word-shuffle':
                            const words = [
                                'discord',
                                'object',
                                'sailboat',
                                'blandishment',
                                'beemo',
                                'apple',
                                'banana',
                                'carrot',
                                'dog',
                                'elephant',
                                'flower',
                                'guitar',
                                'house',
                                'ice cream',
                                'jacket',
                                'kite',
                                'lion',
                                'monkey',
                                'notebook',
                                'orange',
                                'penguin',
                                'queen',
                                'rabbit',
                                'sun',
                                'tree',
                                'umbrella',
                                'violin',
                                'watermelon',
                                'xylophone',
                                'yacht',
                                'zebra'
                            ];
                    
                            const selectedWord = words[Math.floor(Math.random() * words.length)];
                            const shuffledWord = shuffleWord(selectedWord);
                    
                            const startEmbed = new EmbedBuilder()
                                .setColor(color.default)
                                .setTitle('`🔠` Word Shuffle Game')
                                .setDescription(
                                    `**Guess the word!**\n\nThe Shuffled Word: \`${shuffledWord}\`\n\n*You have **30 seconds** to guess! Type your guess in the chat.*`
                                )
                                .setTimestamp()
                                .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
                    
                            await interaction.reply({ embeds: [startEmbed] });
                    
                            const filter2 = (m) => m.author.id === interaction.user.id;
                            const collector2 = interaction.channel.createMessageCollector({ filter2, time: 30000, max: 1 });
                    
                            collector2.on('collect', async (m) => {
                                let resultEmbed = new EmbedBuilder();
                    
                                if (m.content.toLowerCase().trim() === selectedWord) {
                                    resultEmbed
                                        .setColor(color.success)
                                        .setDescription(`> ${emojis.custom.tada2} You guessed the word **correctly**!\n\nThe word was: \`${selectedWord}\``)
                                        .setTimestamp()
                                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
                                } else {
                                    resultEmbed
                                        .setColor(color.fail)
                                        .setDescription(`> ${emojis.custom.fail} ***Sad trombone..*** That was the **incorrect** word!\n\nThe **correct** word was:\n ${emojis.custom.replyend} \`${selectedWord}\``)
                                        .setTimestamp()
                                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
                                }
                    
                                await interaction.followUp({ embeds: [resultEmbed] });
                            });
                    
                            collector2.on('end', (collected) => {
                                if (collected.size === 0) {
                                    const timeoutEmbed = new EmbedBuilder()
                                        .setColor(color.fail)
                                        .setTitle('`⏰` Times Up!')
                                        .setDescription(`> ${emojis.custom.clock} ***Sad trombone..*** You ran out of time! Better luck next time!`)
                                        .setTimestamp()
                                        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });
                                    interaction.followUp({ embeds: [timeoutEmbed] });
                                }
                            });

                            function shuffleWord(word) {
                                const shuffled = word
                                    .split('')
                                    .sort(() => 0.5 - Math.random())
                                    .join('');
                                return shuffled;
                            }

                            break;

                        case 'gunfight':
                            const player = interaction.options.getUser('player');

                            if (player.id === interaction.user.id) {
                                return interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} You **cannot** challenge yourself, are you lonely or something..`)], ephemeral: true });
                            }

                            const acceptButton = new ButtonBuilder()
                                .setCustomId('accept')
                                .setLabel('Accept')
                                .setStyle(ButtonStyle.Success);

                            const declineButton = new ButtonBuilder()
                                .setCustomId('decline')
                                .setLabel('Decline')
                                .setStyle(ButtonStyle.Danger);

                            const row = new ActionRowBuilder().addComponents(acceptButton, declineButton);

                            await interaction.reply({
                            embeds: [new EmbedBuilder().setColor(`${color.default}`).setDescription(`${emojis.custom.wave} Hello, ${player}, you have been **challenged** to a **cowboy game** by ${interaction.user}! Do you want to **accept** this challenge?`)],
                            components: [row],
                        });

                            const filter3 = i => i.user.id === player.id;
                            const collector3 = interaction.channel.createMessageComponentCollector({
                                filter3,
                                time: 60000,
                            });

                            collector3.on('collect', async i => {
                                if (i.user.id !== player.id) {
                                    await i.reply({ embeds: [new EmbedBuilder().setColor(`${color.fail}`).setDescription(`${emojis.custom.forbidden} You **cannot** interact with these buttons. Only ${player} **can** interact with these buttons!`)], ephemeral: true });
                                    return;
                                }

                                if (i.customId === 'accept') {
                                    collector3.stop('accept');
                                    const words = ['shoot', 'draw', 'aim', 'gun', 'reload', 'fire', 'bullets'];
                                    const word = words[Math.floor(Math.random() * words.length)];
                                    const delay = Math.floor(Math.random() * 5000) + 3000;

                            const readyEmbed = new EmbedBuilder()
                                .setTitle('**Get Ready!**')
                                .setDescription(`${emojis.custom.loading} The game will **start** at **any** moment.`)
                                .setImage('https://giffiles.alphacoders.com/102/102565.gif')
                                .setColor(color.default);

                            await interaction.followUp({ embeds: [readyEmbed] });

                            await new Promise(resolve => setTimeout(resolve, delay));

                            await interaction.followUp(`The word is **${word}**! **TYPE NOW!**`);

                            const winnerFilter = m => m.content.toLowerCase() === word.toLowerCase();
                            const winner = await interaction.channel.awaitMessages({ filter: winnerFilter, max: 1, time: 60000 });

                                if (!winner.size) {
                                await interaction.followUp(`${emojis.custom.fail} No one typed the word in time... It's a **tie**!`);
                            } else {
                                const winnerUser = winner.first().author;
                                const winnerEmbed = new EmbedBuilder()
                                    .setTitle(`**Congratulations!** ${emojis.custom.tada2}`)
                                    .setImage('https://media.tenor.com/oDedOU2hfZcAAAAC/anime-cowboybebop.gif')
                                    .setDescription(`${winnerUser} **won** the **cowboy game** against ${interaction.user.id === winnerUser.id ? player : interaction.user}`)
                                    .setColor(color.default);
                                await interaction.followUp({ embeds: [winnerEmbed] });
                            }
                        } else if (i.customId === 'decline') {
                            collector3.stop('decline');
                            await interaction.followUp(`${emojis.custom.fail} ${player} **declined** the challenge.. Maybe next time!`);
                        }
                    });

                    collector3.on('end', async (reason) => {
                        if (reason === 'time') {
                            await interaction.followUp({
                                content: `${emojis.custom.fail} ${player} did **not** respond in time. Maybe next time!`,
                                components: [],
                            });
                        }
                    });

                    break;
                          
            }
        } catch (error) {
            console.log(error);
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
