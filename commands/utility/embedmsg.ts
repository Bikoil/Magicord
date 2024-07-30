const { SlashCommandBuilder } = require('discord.js');

export default {
    data: new SlashCommandBuilder()
        .setName('embedmsg')
        .setDescription('Make the bot send an embed message')
        .addStringOption(option =>
            option.setName('body')
                .setDescription('The body of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The footer of the embed')
                .setRequired(false)),
    async execute(interaction) {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: "You don't have permission to use this command `MISSING PERMISSIONS: ADMINISTRATOR`", ephemeral: true });
        }
        
        // Variables
        const title = interaction.options.getString('title');
        const body = interaction.options.getString('body');
        const footer = interaction.options.getString('footer');
        const embed = {
            color: 0x228B22,
            title: title,
            description: body,
            footer: footer ? { text: footer } : undefined, // Fix for footer
            timestamp: new Date(),
        };

        await interaction.reply({ embeds: [embed] });
    },
};
