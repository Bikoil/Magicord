const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction-roles')
        .setDescription('Create a reaction role embed')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role1')
                .setDescription('The first role')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role2')
                .setDescription('The second role')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role3')
                .setDescription('The third role')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Only allow administrators to use this command
    async execute(interaction) {
        try {
            // Check if the user has administrator permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({ content: "You don't have permission to use this command `MISSING PERMISSIONS: ADMINISTRATOR`", ephemeral: true });
            }

            // Variables
            const title = interaction.options.getString('title');
            const role1 = interaction.options.getRole('role1');
            const role2 = interaction.options.getRole('role2');
            const role3 = interaction.options.getRole('role3');

            const embed = {
                color: 0x90EE90, // Light green
                title: title,
                description: `
__**Choose your Role!**__

**Role 1:** ${role1}
**Role 2:** ${role2}
**Role 3:** ${role3}
                `,
                footer: {
                    text: 'Choose your role through the buttons below',
                },
                timestamp: new Date(),
            };

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('role1')
                        .setLabel('1️⃣ | Role 1')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('role2')
                        .setLabel('2️⃣ | Role 2')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('role3')
                        .setLabel('3️⃣ | Role 3')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('remove_all')
                        .setLabel('🗙 | Remove all roles')
                        .setStyle(ButtonStyle.Danger),
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => ['role1', 'role2', 'role3', 'remove_all'].includes(i.customId);
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                let role;
                if (i.customId === 'role1') {
                    role = role1;
                } else if (i.customId === 'role2') {
                    role = role2;
                } else if (i.customId === 'role3') {
                    role = role3;
                } else if (i.customId === 'remove_all') {
                    try {
                        await i.member.roles.remove(role1);
                        await i.member.roles.remove(role2);
                        await i.member.roles.remove(role3);
                        await i.reply({ content: `All roles have been removed`, ephemeral: true });
                        return;
                    } catch (error) {
                        console.error('Error removing roles:', error);
                        await i.reply({ content: `Failed to remove roles. Please check the bot's permissions.`, ephemeral: true });
                        return;
                    }
                }

                if (role) {
                    try {
                        await i.member.roles.add(role);
                        await i.reply({ content: `You have been given the role ${role}`, ephemeral: true });
                    } catch (error) {
                        console.error('Error adding role:', error);
                        await i.reply({ content: `Failed to assign the role. Please check the bot's permissions.`, ephemeral: true });
                    }
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error during interaction execution:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'An error occurred while executing this command.', ephemeral: true });
            }
        }
    },
};
// Be causious about the roles you offer to be given in the reaction role.