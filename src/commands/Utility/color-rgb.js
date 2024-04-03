const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
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
            description: "Get information about a RGB color"
        });
    }

    /**
     * @param {BeemoCommand.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName('color-rgb')
                .setDescription(this.description)
                .addIntegerOption(option => 
                    option.setName("red").setDescription("The red code of the color").setRequired(true).setMinValue(0).setMaxValue(255)
                )
                .addIntegerOption(option => 
                    option.setName("green").setDescription("The green code of the color").setRequired(true).setMinValue(0).setMaxValue(255)
                )
                .addIntegerOption(option => 
                    option.setName("blue").setDescription("The blue code of the color").setRequired(true).setMinValue(0).setMaxValue(255)
                ),
        );
    }

    /**
     * @param {BeemoCommand.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        const {options} = interaction;
        const r = options.getInteger("red");
        const g = options.getInteger("green");
        const b = options.getInteger("blue");
        const response = await axios.get(`https://www.thecolorapi.com/id?rgb=${r},${g},${b}`)
        const { name, hex, hsl } = response.data;

        const embed = new EmbedBuilder()
            .setColor([r, g, b])
            .addFields(
                {name: "Name", value: name.value || '**N/A**', inline: false},
                {name: "Hex:", value: hex.clean || '**N/A**', inline: false},
                {name: "HSL:", value: `H: ${hsl.h || "**N/A**"}, S: ${hsl.s || "**N/A**"}, L: ${hsl.l || "**N/A**"}`, inline: false},
                {name: "API Link:", value: `[${r},${g},${b}](https://www.thecolorapi.com/id?rgb=${r},${g},${b})`, inline: false},
            )
            .setFooter({ text: "The color is the embed color!"});

            return await interaction.reply({ embeds: [embed] });
    }
}

module.exports = {
    UserCommand
};
