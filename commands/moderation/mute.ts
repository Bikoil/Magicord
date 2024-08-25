import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, GuildMember, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, TextChannel, NewsChannel, ChannelType, Options } from 'discord.js';

@Discord()
export class MuteCommand {
    private permissionsSet = new Set<string>(); // Store channel IDs where permissions have been set

    @Slash({
        name: 'mute',
        description: 'Mute a user in the server',
    })
    async mute(
        @SlashOption({
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to mute',
            required: true,
        }) user: GuildMember,
        @SlashOption({
            name: 'reason',
            type: ApplicationCommandOptionType.String,
            description: 'The reason for muting the user',
            required: false,
        }) reason: string | null,
        @SlashOption({
            name: 'time',
            type: ApplicationCommandOptionType.String,
            description: 'The duration for which the user will be muted (e.g., 1m, 2h)',
            required: false,
        }) time: string | null,
        interaction: CommandInteraction
    ): Promise<void> {
        // Check if the user has administrator permissions
        if (!(interaction.member instanceof GuildMember) || !interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            await interaction.reply({
                content: "> *You don't have permission to use this command `MISSING PERMISSIONS: TIMEOUT_MEMBERS`*",
                ephemeral: true
            });
            return;
        }

        // Ensure guild is defined
        if (!interaction.guild) {
            await interaction.reply({
                content: '> *Guild not found.*',
                ephemeral: true
            });
            return;
        }

        // Create or get the mute role
        let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            muteRole = await interaction.guild.roles.create({
                name: 'Muted',
                permissions: [],
                reason: 'Mute role needed for muting users',
            });

            if (muteRole) {
                // Sort roles by position to find the highest one
                const sortedRoles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).first();
                const topRolePosition = sortedRoles ? sortedRoles.position - 1 : 0;

                await muteRole.setPosition(topRolePosition);
            }
        }

        if (!muteRole) {
            await interaction.reply({
                content: '> *Could not create or find the mute role. Please check the bot\'s permissions.*',
                ephemeral: true
            });
            return;
        }

        // Apply the mute role to the user
        await user.roles.add(muteRole);

        // Update permissions for all text channels if not already set
        const guild = interaction.guild;
        if (guild) {
            guild.channels.cache.forEach(async (channel) => {
                if ((channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews) && !this.permissionsSet.has(channel.id)) {
                    const textChannel = channel as TextChannel | NewsChannel;
                    await textChannel.permissionOverwrites.edit(muteRole, {
                        SendMessages: false,
                        SendMessagesInThreads: false,
                        AddReactions: false,
                    });

                    // Mark permissions as set for this channel
                    this.permissionsSet.add(channel.id);
                }
            });
        }

        // Handle the unmute after the time expires if specified
        if (time) {
            const ms = this.parseTime(time);
            if (ms) {
                setTimeout(async () => {
                    if (guild) {
                        await user.roles.remove(muteRole);
                        await interaction.channel?.send({
                            content: `${user.user.username} **has been unmuted automatically, After a ${time} mute.**`,
                        });

                        // Restore permissions for all text channels
                        guild.channels.cache.forEach(async (channel) => {
                            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews) {
                                const textChannel = channel as TextChannel | NewsChannel;
                                await textChannel.permissionOverwrites.edit(muteRole, {
                                    SendMessages: null,
                                    SendMessagesInThreads: null,
                                    AddReactions: null,
                                });
                            }
                        });
                    }
                }, ms);
            } else {
                await interaction.reply({
                    content: '> *Invalid time format. Please use a valid time format like 1m or 2h.*',
                    ephemeral: true
                });
                return;
            }
        }

        // Respond with confirmation embed
        const embed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setTitle('<:MuteUser:1138519185757053008> USER MUTED <:MuteUser:1138519185757053008>')
            .setDescription(`${user.user.tag} has been muted.`)
            .addFields(
                { name: 'Moderator', value: interaction.user.tag, inline: true },
                { name: 'Reason', value: reason || 'No reason provided', inline: true },
                { name: 'Time', value: time || 'No time provided', inline: true}
            )
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp();
        await interaction.deferReply();
        await interaction.editReply({ embeds: [embed] });
    }

    private parseTime(time: string): number | null {
        const match = time.match(/^(\d+)([smh])$/);
        if (!match) return null;
        const [_, amount, unit] = match;
        const milliseconds = parseInt(amount, 10) * (unit === 's' ? 1000 : unit === 'm' ? 60000 : 3600000);
        return milliseconds;
    }
}
