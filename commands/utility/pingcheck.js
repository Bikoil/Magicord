const { SlashCommandBuilder } = require('discord.js');
const os = require('os');
const system = os.platform();
module.exports = {
	data: new SlashCommandBuilder()
        
		.setName('pingcheck')
		.setDescription('Check if the bot is up and running!'),
	async execute(interaction) {
		await interaction.reply(`Pong! The bot is up and running using \`node index.js\` currently running on ${system}`);
	},
};
