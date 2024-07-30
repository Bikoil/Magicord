const { SlashCommandBuilder } = require('discord.js');

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the user')
                .setRequired(false)),
    async execute(interaction) {
        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return await interaction.reply({ content: "> *You don't have permission to use this command `MISSING PERMISSIONS: BAN_MEMBERS`*", ephemeral: true });
        }

        // User has BAN_MEMBERS permissions, proceed with the command execution
        // Make sure you are causious while editing the permissions.
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the user is bannable
        if (!user.bannable) {
            return await interaction.reply({ content: "> *I cannot ban this user, they may be a user with ADMINISTRATOR perms, or a user with a role higher than me or higher than you*", ephemeral: true });
        }

        // Ban the user
        await user.ban({ reason: reason });

        // Respond with confirmation embed
        const embed = {
            color: 0xff0000,
            title: '<:Ban:1138521731003322429> USER BAN <:Ban:1138521731003322429>',
            description: `${user.user.tag} has been banned from the server.`,
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
// Edit this with caution, you can easily make a backdoor for bans which can cause raids.




//also uhh i forgor

