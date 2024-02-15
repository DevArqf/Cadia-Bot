const { WebhookClient, EmbedBuilder } = require("discord.js");

module.exports = (client) => {
  process.removeAllListeners();

  const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1207130146600001607/axgrzGUu_HWAlG-Tw-KSuf1J-XJPs0nwGloQRfqcMi8am7EChNL-dj5BnnQHToQpSEqx' });

  const embed = new EmbedBuilder()
    .setColor(`Red`)
    .setAuthor({ name: `❌ • An error has been detected by Beemo!` });

  process.on("unhandledRejection", (reason, p) => {

    let reasonString = reason instanceof Error ? reason.stack : String(reason);

    webhook.send({
      username: 'Error!',
      avatarURL: '',
      embeds: [embed.setDescription(`\`\`\`javascript\n${reasonString}\n\`\`\``)],
    });

    console.error(reason, p);
  });

  process.on("uncaughtException", (err, origin) => {
    let errString = err instanceof Error ? err.stack : String(err);

    webhook.send({
      username: 'Error!',
      avatarURL: '',
      embeds: [embed.setDescription(`\`\`\`javascript\n${errString}\n\`\`\``)],
    });

    console.error(err, origin);
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    let errString = err instanceof Error ? err.stack : String(err);

    webhook.send({
      username: 'Error!',
      avatarURL: '',
      embeds: [embed.setDescription(`\`\`\`javascript\n${errString}\n\`\`\``)],
    });

    console.error(err, origin);
  });

  process.on("multipleResolves", () => {});
};
