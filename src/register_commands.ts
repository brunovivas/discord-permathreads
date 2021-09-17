import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import {config as dotenv_config } from 'dotenv';
import { SlashCommandBuilder } from '@discordjs/builders';
dotenv_config();

const commands = [ new SlashCommandBuilder()
	.setName('permathread')
	.setDescription('Creates a thread that never expires')
	.addStringOption(option =>
		option.setName('name')
			.setDescription('Name of the permathread')
			.setRequired(true))
]

if (!process.env.PERMATHREADS_BOT_TOKEN) {
    console.error('PERMATHREADS_BOT_TOKEN variable not set');
    process.exit(1);
}

const rest = new REST({ version: '9' }).setToken(process.env.PERMATHREADS_BOT_TOKEN);

(async () => {

	if (!process.env.PERMATHREADS_BOT_ID) {
		console.error('PERMATHREADS_BOT_ID variable not set');
		process.exit(1);
	}

	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(process.env.PERMATHREADS_BOT_ID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();