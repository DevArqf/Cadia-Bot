const { SlashCommandBuilder, EmbedBuilder, Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-embed")
        .setDescription("Create an embed message")
        .addStringOption(option => option
            .setName("title")
            .setDescription("The title of the embed")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("description")
            .setDescription("The description")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("color")
            .setDescription("The color of the embed")
            .setRequired(true)
            .addChoices(
                {name: "aqua", value: "#00FFFF"},
                {name: "blurple", value: "#7289DA"},
                {name: "fuchsia", value: "#FF00FF"},
                {name: "gold", value: "#FFD700"},
                {name: "green", value: "#008000"},
                {name: "grey", value: "#808080"},
                {name: "greyple", value: "#7D7F9A"},
                {name: "light-grey", value: "#D3D3D3"},
                {name: "luminos-vivid-pink", value: "#FF007F"},
                {name: "navy", value: "#000080"},
                {name: "not-quite-black", value: "#232323"},
                {name: "orange", value: "#FFA500"},
                {name: "purple", value: "#800080"},
                {name: "red", value: "#FF0000"},
                {name: "white", value: "#FFFFFF"},
                {name: "yellow", value: "#FFFF00"},
                {name: "blue", value: "#0000FF"},
                {name: "beemo", value: "#50a090"}
            )
        )
        .addChannelOption(option => option
            .setName("footer")
            .setDescription("The footer ")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("hyperlink-name")
            .setDescription("Name of the hyperlink")
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName("hyperlink-link")
            .setDescription("Add a hyperlink")
            .setRequired(false)
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel you will send this message")
            .setRequired(false)
        ),

    async execute(interaction, client) {
        const color = interaction.options.getString("color");
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const hyperlinkName = interaction.options.getString("hyperlink-name");
        const hyperlinkLink = interaction.options.getString("hyperlink-link");
        const footer = interaction.options.getString("footer")
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        if (!interaction.member.permissions.has(Permissions.FLAGS.ManageMessages)) {
            return interaction.reply("`❌` You don't have permission to execute this command.");
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setFooter(footer);

        if (hyperlinkName && hyperlinkLink) {
            embed.addField("Link:", `[${hyperlinkName}](https://${hyperlinkLink})`);
        }

        try {
            await channel.send({ embeds: [embed] });
            await interaction.reply("`✅` Beemo has successfully sent the embed!");
        } catch (error) {
            console.error("`❌` Error Sending Embed:", error);
            await interaction.reply("Beemo has encountered an error while sending the embed.");
        }
    }
};
