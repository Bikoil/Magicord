const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to kivk')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user')
                .setRequired(false)),
    async execute(interaction) {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return await interaction.reply({ content: "> *You don't have permission to use this command `MISSING PERMISSIONS: KICK_MEMBERS`*", ephemeral: true });
        }

        // User has KICK_MEMBERS permissions, proceed with the command execution
        // Make sure you are causious while editing the permissions, like the ban command.
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the user is kickable
        if (!user.kickable) {
            return await interaction.reply({ content: "> *I cannot kick this user, they may be a user with ADMINISTRATOR perms, or a user with a role higher than me or higher than you*", ephemeral: true });
        }

        // Kick the user
        await user.kick({ reason: reason });

        // Respond with confirmation embed
        const embed = {
            color: e04700,
            title: '<:kick:1130774030291587162> USER KICK <:kick:1130774030291587162>',
            description: `${user.user.tag} has been kicked from the server.`,
            fields: [
                {
                    name: 'Moderator',
                    value: interaction.user.tag,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: reason,
                    inline: true,
                },
            ],
            footer: {
                text: `ID: ${user.id}`,
            },
            timestamp: new Date(),
        };
        

        await interaction.reply({ embeds: [embed] });
    },
};
// Edit this with caution, you can easily make a backdoor for kicks which can cause raids, that can cause mass kicks of members in the server




//also uhh i forgor 2

