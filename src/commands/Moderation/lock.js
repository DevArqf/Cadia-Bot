const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require("../../config/footer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel for a specific role')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option => option.setName('channel').setDescription('The channel you want to lock').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role you want to restrict from sending messages').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    const errEmbed = new EmbedBuilder()
      .setTitle('`❌` Error Locking Channel')
      .setColor(0xff0000)
      .setDescription('`❌` • You must have the **Manage Channels** permission to use this command!');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ embeds: [errEmbed] });

    channel.permissionOverwrites.create(role, { SendMessages: false });

    const embed = new EmbedBuilder()
      .setTitle('`🔒` Channel Locked')
      .setDescription(`• <:bl_check_mark:1206436519498354738> ${channel} has been locked.`)
      .addFields(
        { name: '• `🔒` Locked for Role:', value: `> ${role}`, inline: false },
        { name: '• <:bl_clock:1206612806560915547> Time:', value: `> <t:${new Date()}:f>`, inline: false },
        { name: '• `🔒` Locked by:', value: `> <@${interaction.user.id}>`, inline: false },
      )
      .setColor(0x50a090)
      .setTimestamp()
      .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed] });
  },
};