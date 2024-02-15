const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const Feedback = require("../../schemas/feedbackSchema");
const footer_message = require('../../config/footer')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Setup a feedback system in your server!")
    .addSubcommand(subcommand =>
      subcommand
        .setName("setup")
        .setDescription("Setup the feedback system")
        .addChannelOption(option => option.setName("feedback-channel").setDescription("The channel you want the feedbacks to go into").setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("disable")
        .setDescription("Disable the feedback system.")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('send')
        .setDescription('Give some feedback to the server staff\'s!')
        .addStringOption(option =>
            option.setName('feedback')
                .setDescription('Write your feedback.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('star')
                .setDescription('Rate the feedback with stars.')
                .setRequired(true)
                .addChoices({ name:'⭐', value: '⭐'},
                            { name:'⭐⭐', value: '⭐⭐'},
                            { name:'⭐⭐⭐', value: '⭐⭐⭐'},
                            { name:'⭐⭐⭐⭐', value: '⭐⭐⭐⭐'},
                            { name:'⭐⭐⭐⭐⭐', value: '⭐⭐⭐⭐⭐'}
                )
        )
    ),
    userPermissions: [],
    botPermissions: [],
  

    async run(client, interaction) {
    const data = await Feedback.findOne({ Guild: interaction.guild.id });
  
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "setup":
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          const errEmbed = new EmbedBuilder()
            .setDescription(`<:bl_x_mark:1206436599794241576> • You do not have **permission** to **execute** this command!`)
			.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(interaction.client.user.displayAvatarURL())
            .setColor('#020202');
    
          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        if (data) {
          const alreadyEmbed = new EmbedBuilder()
              .setColor(`#50a090`)
			  .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			  .setThumbnail(interaction.client.user.displayAvatarURL())
              .setDescription(`<:bl_x_mark:1206436599794241576> • **Looks like Beemo has already detected your **Feedback System** in our database!**`);
          return await interaction.reply({ embeds: [alreadyEmbed], ephemeral: true });
      } else {
          const FeedbackChannel = interaction.options.getChannel('feedback-channel');
          const newData = await Feedback.create({
              Guild: interaction.guild.id,
              FeedbackChannel: FeedbackChannel.id,
          });
          newData.save();
      
          const feedbacksetup = new EmbedBuilder()
              .setColor('#50a090')
              .setDescription(`<:bl_check_mark:1206436519498354738> • Beemo has **successfully** configured your **Feedback System**! To disable, run \`feedback disable\`!`)
			  .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			  .setThumbnail(interaction.client.user.displayAvatarURL())
              .addFields(
                  { name: '**• Feedback Channel**', value: `${FeedbackChannel}` },
              )
      
          return await interaction.reply({ embeds: [feedbacksetup], ephemeral: true });
      }      
        break;
      case "disable":
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          const errEmbed1 = new EmbedBuilder()
            .setDescription(`<:bl_x_mark:1206436599794241576> • You do not have **permission** to **execute** this command!`)
			.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(interaction.client.user.displayAvatarURL())
            .setColor('#50a090');
    
          return interaction.reply({ embeds: [errEmbed1], ephemeral: true });
        }

        if (!data) {
            const alredy = new EmbedBuilder()
            .setColor(`#50a090`)
            .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription(`<:bl_x_mark:1206436599794241576> • Beemo couldn't find your **Feedback System** in our database!`)
            return interaction.reply({ embeds: [alredy], ephemeral: true });
          } else {
              await Feedback.deleteOne({ Guild: interaction.guild.id });
              const deleted = new EmbedBuilder()
              .setColor(`#50a090`)
              .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			  .setThumbnail(interaction.client.user.displayAvatarURL())
              .setDescription(`<:bl_check_mark:1206436519498354738> • Beemo has **successfully deleted** your **feedback** channel!`)
              return interaction.reply({ embeds: [deleted] , ephemeral: true });
            }
        break;

        case "send":
           if (!data ) {
            const notset = new EmbedBuilder()
            .setColor(`#50a090`)
			.setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			.setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription(`<:bl_x_mark:1206436599794241576> • The **Feedback System** has not been set up here, use \`feedback setup\` to set it up!`)
            return await interaction.reply({embeds: [notset] , ephemeral: true });
          }

          const star = interaction.options.getString('star');
          const feedback = interaction.options.getString('feedback');
          const feedbackChannel = interaction.client.channels.cache.get(data.FeedbackChannel);
          
          const embed = new EmbedBuilder()
              .setColor('#50a090')
              .setTitle('`📮` **New Feedback!**')
			  .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			  .setThumbnail(interaction.client.user.displayAvatarURL())
              .setDescription(`${interaction.user} has submitted a feedback!`)
              .addFields({ name: '**Description:**', value: `${feedback}` })
              .addFields({ name: '**Stars**', value: `${star}` });
  
          const embed1 = new EmbedBuilder()
              .setColor('#50a090')
			  .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
			  .setThumbnail(interaction.client.user.displayAvatarURL())
              .setDescription(`<:bl_check_mark:1206436519498354738> • Beemo has **successfully** sent your feedback in ${feedbackChannel}!`);
  
          feedbackChannel.send({ embeds: [embed] });
          await interaction.reply({ embeds: [embed1], ephemeral: true });
        break;
        default:
        break;
    }
  },
};