const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;
const os = require('os');
const cliProgress = require('cli-progress');
const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(chalk.green('🤖 Beemo is ready for adventure!'));
		console.log(chalk.green('🧩 Beemo animated avatar has been uploaded successfully!'));

        const commandCount = client.commands.size;
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const totalGuilds = client.guilds.cache.size;
        const botVersion = 'Beta 1.0.0';
        const botOwner = 'Malik & Navin';

        function displayAdvancedConsole() {
            console.clear();
            console.log(chalk.yellow(figlet.textSync('Bot Status', { horizontalLayout: 'full' })));
            console.log(chalk.blue('=================================='));
            console.log(chalk.magenta(`Command Count: ${commandCount}`));
            console.log(chalk.cyan(`Total Members: ${totalMembers}`));
            console.log(chalk.green(`Total Guilds: ${totalGuilds}`));
            console.log(chalk.red(`Beemo's Launch Time: ${new Date().toLocaleString()}`));
            console.log(chalk.blue(`Beemo's Version: ${botVersion}`));
            console.log(chalk.magenta(`Storage Used: ${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`));
            console.log(chalk.cyan(`Total RAM: ${Math.round(os.totalmem() / 1024 / 1024)} MB`));
            console.log(chalk.green(`CPU: ${os.cpus()[0].model}`));
            console.log(chalk.red(`Beemo's Founders: ${botOwner}`));
            console.log(chalk.magenta(`Beemo's Developers: Coming Soon`));
            console.log(chalk.blue('=================================='));
        }


        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);
            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                        },
                    ],
                    status: statusArray[option].status,
                });
            } catch (error) {
                console.error(error);
            }
        }


        if (!mongoURL) return;


        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(100, 0);

        try {

            for (let i = 0; i <= 100; i++) {
                await new Promise(resolve => setTimeout(resolve, 20)); 
                progressBar.update(i);
            }
            progressBar.stop();


            await mongoose.connect(mongoURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('✅ Beemo has Connected to MongoDB');
        } catch (error) {
            progressBar.stop();
            console.error('❌ Beemo has Failed to connect to MongoDB:', error);
        }


        displayAdvancedConsole();
    },
};