// Import necessary modules
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { inspect } = require('util');
const beautify = require("beautify");
const footer_message = require('../../config/footer')

// Export a module with data and execute function
module.exports = {
    // Slash command data
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates code (DEV ONLY)')
        .addStringOption(option => option.setName('code').setDescription('The code to evaluate').setRequired(true)),

    // Execute function
    async execute(interaction, client) {
        // Array of user IDs considered as owners
        const owners = [
            "899385550585364481",
            "863508137080127518"
        ];

        // Check if the user is an owner
        if (!owners.includes(interaction.user.id)) return;

        // Get the code from the interaction options
        const code = interaction.options.getString('code');
        
        // Create a regular expression to filter out the bot token from the code
        const tokenfilter = new RegExp(`${client.token.split("").join("[^]{0,2}")}|${client.token.split("").reverse().join("[^]{0,2}")}`, "g");

        try {
            // Evaluate the code
            let output = eval(code);
            // If the output is a promise, wait for it to resolve
            if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
            // Inspect the output
            output = inspect(output);
            // Replace the bot token with "no" in the output
            output = output.replace(tokenfilter, "no");

            // Measure the time taken to execute the code
            let start, end;
            start = new Date();
            for (let i = 0; i < 1000; i++) {
                Math.sqrt(i);
            }
            end = new Date();

            // Beautify the evaluated code for display
            const evaluatedCode = beautify(code, { format: "js" });

            // Create an embed to display the evaluated code and output
            const embed = new EmbedBuilder()
                .setColor('#50a090')
                .setTitle('`🔍` Evaluated Code')
                .setFooter({ text: `${footer_message}`, iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setDescription(`\`\`\`js\n${evaluatedCode}\n\`\`\`\n**• Output:**\n\`\`\`${output.replaceAll("'", '')}\`\`\`\n**Operation took** \`${end?.getTime() - start?.getTime()}\` **millisecond**${end?.getTime() - start?.getTime() > 1 ? 's' : ''}.`)
                .setTimestamp();

            // Check if embed size is within limits for Discord
            if (embed.length < 1800) {
                // If within limits, reply with embed
                interaction.reply({ embeds: [embed] });
            } else {
                // If exceeds limits, reply without embed
                interaction.reply({ content: `**Operation took** \`${end?.getTime() - start?.getTime()}\` **millisecond**${end?.getTime() - start?.getTime() > 1 ? 's' : ''}.` });
            }

            // Create a collector for message components (buttons)
            const filter = (i) => {
                if (i.user.id === interaction.author.id) return true;
                i.reply({ content: `<:bl_x_mark:1206436599794241576> **• You do not have access to execute this command!**`, ephemeral: true });
                return false;
            }

            const collector = await interaction.channel.createMessageComponentCollector({
                filter,
                componentType: 'BUTTON'
            })

            // Handle button click events
            collector.on("collect", async (i) => {
                i.deferUpdate()
                if (i.customId === "delete-evaluated-output") {
                    i.message.delete()
                }
            })

        } catch (error) {
            // If an error occurs, send the error message to the channel
            interaction.channel.send({ content: ` \`\`\`js\n${error}\`\`\` ` });
        }
    }
}
