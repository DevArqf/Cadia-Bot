const { Listener } = require('@sapphire/framework');
const { EmbedBuilder } = require("discord.js");
const { color, emojis } = require('../config');
const { WelcomeSchema } = require('../lib/schemas/welcomeSchema');

class UserEvent extends Listener {

    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'guildMemberAdd',
            once: false
        });
    }

    async run(member) {
        const find = await WelcomeSchema.findOne({ guildId: member.guild.id });
        if (!find) return;

        const guild = await member.client.guilds.cache.get(`${member.guild.id}`);
        const totalMembers = guild.memberCount;

        // Message infos
        const message = find.message.replace('{userId}',  member.id).replace('{serverName}', member.guild.name).replace('{userMention}', `<@${member.id}>`).replace('{serverMembers}', totalMembers).replace(/\\n/g, '\n')

        const channel = await member.client.channels.cache.get(`${find.welcomeChannelId}`);

        if (find.messageType === 'embed') {

            const embedTitle = find.title === null ? ' ' : find.title.replace('{userId}',  member.id).replace('{serverName}', member.guild.name).replace('{serverMembers}', totalMembers)

            const embedFooter = find.footer === null ?  ' ' : find.footer.replace('{userId}',  member.id).replace('{serverName}', member.guild.name).replace('{userMention}', member.id).replace('{serverMembers}', totalMembers)

            const embedHex = find.hexCode || color.default;
            const embedThumbNailURL = find.thumbnailImage;
            const iconURL = find.iconURL;
            const authorName = find.authorName === null ? ' ' : find.authorName;

                const embed = new EmbedBuilder()
                    .setColor(`${embedHex}`)
                    .setTitle(`${embedTitle}`)
                    .setDescription(`${message}`)
                    .setFooter({ text: `${embedFooter}` })
                    .setImage(embedThumbNailURL)
                    .setThumbnail(iconURL)
                    .setAuthor({ name: `${authorName}` })

                return await channel.send({ embeds: [embed] });

            } else {
                return await channel.send(message);
            }

     }
}

module.exports = {
    UserEvent
};