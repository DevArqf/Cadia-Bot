const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require("../../config/footer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel for a specific role')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option.setName('channel').setDescription('The channel you want to unlock').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role to unlock the channel for').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    channel.permissionOverwrites.create(role.id, { SendMessages: true });

    const embed = new EmbedBuilder()
    .setTitle('`🔒` Channel Unlocked')
    .setDescription(`• <:bl_check_mark:1206436519498354738> ${channel} has been unlocked.`)
    .addFields(
      { name: '• `🔒` Unlocked for Role:', value: `> ${role}`, inline: false },
      { name: '• <:bl_clock:1206612806560915547> Time:', value: `> <t:${new Date()}:f>`, inline: false },
      { name: '• `🔒` Unlocked by:', value: `> <@${interaction.user.id}>`, inline: false },
    )
    .setColor(0x50a090)
    .setTimestamp()
    .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] });
  },
};