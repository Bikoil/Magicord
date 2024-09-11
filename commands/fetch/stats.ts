import { Discord, Slash } from 'discordx';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { execSync } from 'child_process';


// Function to get Linux distribution details
function getLinuxDistro(): string {
    try {
        const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
        const lines = osRelease.split('\n');
        let distro = 'Unknown Linux';
        lines.forEach(line => {
            if (line.startsWith('PRETTY_NAME')) {
                distro = line.split('=')[1].replace(/"/g, '');
            }
        });
        return `${distro} ${os.release()}`;
    } catch {
        return `Linux ${os.release()}`;
    }
}

// Function to get Windows version
function getWindowsVersion(): string {
    try {
        const version = execSync('ver', { encoding: 'utf8' }).trim();
        return `Windows ${version}`;
    } catch {
        return `Windows ${os.release()}`;
    }
}

// Function to get macOS version
function getMacOSVersion(): string {
    try {
        const version = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
        return `macOS ${version} ${os.release()}`;
    } catch {
        return `macOS ${os.release()}`;
    }
}

// Function to get system details
function getSystemDetails(): string {
    const platform = os.platform();
    if (platform === 'linux') {
        return getLinuxDistro();
    } else if (platform === 'win32') {
        return getWindowsVersion();
    } else if (platform === 'darwin') {
        return getMacOSVersion();
    }
    return platform;
}

// Function to get CPU type
function getCpuType(): string {
    const cpus = os.cpus();
    return cpus[0].model;
}

// Function to get CPU usage
function getCpuUsage(): number {
    const cpus = os.cpus();
    const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const total = cpus.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq, 0);
    return ((total - idle) / total) * 100;
}

// Function to get memory usage
function getMemoryUsage(): string {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    return `${(usedMem / 1024 / 1024).toFixed(2)}MB/${(totalMem / 1024 / 1024).toFixed(2)}MB`;
}

// Function to get the user
function getUser(): string {
    return process.env.USER || 'Unknown User';
}

@Discord()
export class AppDiscord {
    @Slash(new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get bot statistics and system information!')
    )
    async stats(interaction: CommandInteraction): Promise<void> {
        const guildCount = interaction.client.guilds.cache.size;
        const cpuUsage = getCpuUsage().toFixed(2);
        const memoryUsage = getMemoryUsage();
        const system = getSystemDetails();
        const user = getUser();
        const cpuType = getCpuType();

        // Fetch commands 
        const globalCommands = await interaction.client.application?.commands.fetch();
        const commandCount = globalCommands ? globalCommands.size : 0;

        const message = `**Bot Statistics**\n` +
                        `> **Servers:** ${guildCount}\n` +
                        `> **RAM Usage:** ${memoryUsage}\n` +
                        `> **CPU Usage:** ${cpuUsage}%\n` +
                        `> **CPU Type:** ${cpuType}\n` +
                        `> **Commands:** ${commandCount}\n` +
                        `> **OS:** ${system}\n` +
                        `> **Host Machine:** ${os.hostname()}\n` +
                        `> **User:** ${user}`;

        await interaction.deferReply();
        await interaction.editReply({ content: message });
    }
}
