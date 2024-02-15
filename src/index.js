const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ChannelType, ActionRowBuilder, ButtonBuilder, Events, ButtonStyle } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

// Avatar GIF
client.once('ready', async () => {

  try {
      const avatarData = fs.readFileSync('./avatar.gif');
      await client.user.setAvatar(avatarData);
  } catch (error) {
      console.error('`❌` • Beemo failed to upload animated avatar:', error);
  }
});

// Server Join Message
client.on('guildCreate', async guild => {
    try {
      const owner = await guild.fetchOwner();
      const avatarURL = client.user.displayAvatarURL({ format: 'png', size: 512 });
      const topChannel = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id).first();
      const embed = new EmbedBuilder()
        .setColor('#50a090')
		.setTitle('`⚙️` Beemo\'s System Message `⚙️`')
        .setDescription('**• Thank you for adding me to your server!**\n <:sub_symbol:1206434900203540500> If you need any help, please feel free to join\n ⠀⠀<:sub_symbol:1206434900203540500> our support server.\n\n **• Important**\n <:sub_symbol:1206434900203540500> Make sure the bot\'s role is at the highest position\n ⠀⠀<:sub_symbol:1206434900203540500> in the role hierarchy to prevent any bugs or issues.')
        .setThumbnail(avatarURL);

      const channel = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji("<:Home:1206440941335089153>")
            .setLabel('Support Server')
            .setURL('https://discord.gg/SrYexYcKZ2')
			.setStyle(ButtonStyle.Link),

            new ButtonBuilder()
            .setEmoji("<:person_add:1206441060494999592>")
            .setLabel('Invite bot')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=1200475110235197631&permissions=70368744177655&scope=bot')
			.setStyle(ButtonStyle.Link),

            new ButtonBuilder()
			.setEmoji("<:Chart:1206440620659576913>")
            .setLabel('Vote')
            .setURL("https://top.gg/bot/1100445112980471889")
			.setStyle(ButtonStyle.Link)

        );

        const dmbot = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji("<:Home:1206440941335089153>")
            .setLabel('Support Server')
            .setURL('https://discord.gg/SrYexYcKZ2')
			.setStyle(ButtonStyle.Link),

            new ButtonBuilder()
            .setEmoji("<:Chart:1206440620659576913>")
            .setLabel('Vote')
            .setURL("https://top.gg/bot/1100445112980471889")
			.setStyle(ButtonStyle.Link)
            
        );

      owner.send({ embeds: [embed], components: [dmbot] });
      topChannel.send({ embeds: [embed], components: [channel] });

    } catch (error) {
      console.error(`Beemo was unable to send message to server owner for guild ${guild.name}.`, error);
    }
});

// Rotating Status
const { ActivityType } = require('discord.js');

function setBotActivities(client) {
    const totalServers = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);

    client.user.setActivity({
        type: ActivityType.Watching,
        name: `${totalServers} Servers`
    });

    setTimeout(() => {
        client.user.setActivity({
            type: ActivityType.Listening,
            name: "/𝗵𝗲𝗹𝗽"
        });

        setTimeout(() => {
            client.user.setActivity({
                type: ActivityType.Watching,
                name: `${totalMembers} Total Members`
            });

            setTimeout(() => {
                setBotActivities(client);
            }, 20000);
        }, 20000);
    }, 20000);
};

client.on('ready', async () => {
    setBotActivities(client);
});
