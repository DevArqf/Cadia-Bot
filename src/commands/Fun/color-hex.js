const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const axios = require("axios");

class UserCommand extends BeemoCommand {
    /**
     * @param {BeemoCommand.Context} context
     * @param {BeemoCommand.Options} options
     */
    constructor(context, options) {
        super(context, {
            ...options,
            description: "Get information about a HEX color"
        });
    }

    /**
     * @param {BeemoCommand.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName('color-hex')
                .setDescription(this.description)
                .addStringOption(option => option
                    .setName("code")
                    .setDescription("The hex color code without #")
                    .setRequired(true)
                    .setMinLength(6)
                    .setMaxLength(6)),
        );
    }

    /**
     * @param {BeemoCommand.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        const { options } = interaction;
        const hexCode = options.getString("code");
        const response = await axios.get(`https://www.thecolorapi.com/id?hex=${hexCode}`);
        const { name, rgb, hsl } = response.data;

        const embed = new EmbedBuilder()
            .setColor(hexCode)
            .addFields(
                {name: "Name:", value: `${name.value || "**N/A**"}`, inline: false},
                {name: "RGB:", value: `R: ${rgb.r || "**N/A**"}, G: ${rgb.g || "**N/A**"}, B: ${rgb.b || "**N/A**"}`, inline: false},
                {name: "HSL:", value: `H: ${hsl.h || "**N/A**"}, S: ${hsl.s || "**N/A**"}, L: ${hsl.l || "**N/A**"}`, inline: false},
                {name: "API Link:", value: `[${hexCode}](https://www.thecolorapi.com/id?hex=${hexCode})`, inline: false},
            )
            .setFooter({ text: "The color is the embed color!"});

            return await interaction.reply({ embeds: [embed] });
    }
}

module.exports = {
    UserCommand
};
