const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Make the bot say anything')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message you want the bot to say')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: "You don't have permission to use this command `MISSING PERMISSIONS: ADMINISTRATOR`", ephemeral: true });
        }

        // User has administrator permissions, proceed with the command execution
        const message = interaction.options.getString('message');
        await interaction.reply(message);
    },
};
