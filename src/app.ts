import { Client, Intents, TextChannel, ThreadChannel } from 'discord.js'
import { CronJob } from 'cron';
import config from "./config";
import {config as dotenv_config } from 'dotenv';
dotenv_config();

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.once('ready', () => {
	console.log('Ready!');
});

var bumpJob = new CronJob('* 1 * * * *', () => { bumpArchived(bot); });

async function bumpArchived(bot: Client)
{
	if (config.permathreads.length <= 0) {
		return;
	}

    for (const [, guild] of bot.guilds.cache) {
        for (const [,channel] of guild.channels.cache) {
            if (!(channel instanceof TextChannel)) {
				continue;
			}

			let fetched = await (channel as TextChannel).threads.fetchArchived();
			for (const [,thread] of fetched.threads) {
				if (thread.archived && isPermathread(thread)) {
					await bumpPermathread(thread);
				}
			}
        }
    }
}

function isPermathread(thread: ThreadChannel) {
	return config.permathreads.includes(parseInt(thread.id));
}

async function bumpPermathread(thread: ThreadChannel) {
	console.log(`Bumping permathread ${thread.name}`);
	await thread.setArchived(false);
}

bot.on('threadUpdate', async (oldThread, newThread) => {
	if (newThread.archived && isPermathread(newThread)) {
		await bumpPermathread(newThread);
	}
});

bot.login(process.env.PERMATHREADS_BOT_TOKEN);

bot.once('ready', () => {
	console.log(`Connected to Discord as ${bot.user?.tag}`);
    bumpJob.start();
});