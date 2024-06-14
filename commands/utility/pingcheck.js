const { SlashCommandBuilder } = require('discord.js');
const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');

// Function to get Linux distribution
function getLinuxDistro() {
    try {
        const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
        const lines = osRelease.split('\n');
        let distro = 'Unknown Linux';
        lines.forEach(line => {
            if (line.startsWith('PRETTY_NAME')) {
                distro = line.split('=')[1].replace(/"/g, '');
            }
        });
        return distro;
    } catch (err) {
        return 'Unknown Linux';
    }
}

// Function to get Android version
function getAndroidVersion() {
    try {
        const version = execSync('getprop ro.build.version.release', { encoding: 'utf8' }).trim();
        return `Android ${version}`;
    } catch (err) {
        return 'Unknown Android';
    }
}

// Function to get Windows version
function getWindowsVersion() {
    try {
        const version = execSync('ver', { encoding: 'utf8' }).trim();
        return version;
    } catch (err) {
        return 'Unknown Windows';
    }
}

// Function to check if running in Docker
function isDocker() {
    return fs.existsSync('/.dockerenv');
}

// Function to check if running in Kubernetes
function isKubernetes() {
    return process.env.KUBERNETES_SERVICE_HOST !== undefined;
}

// Function to get system details
function getSystemDetails() {
    const platform = os.platform();
    let systemDetails = '';
    if (platform === 'linux') {
        systemDetails = getLinuxDistro();
    } else if (platform === 'android') {
        systemDetails = getAndroidVersion();
    } else if (platform === 'win32') {
        systemDetails = getWindowsVersion();
    } else {
        systemDetails = platform;
    }

    // Check for Docker and Kubernetes
    if (isDocker()) {
        systemDetails += ' (Docker)';
    }
    if (isKubernetes()) {
        systemDetails += ' (Kubernetes)';
    }

    return systemDetails;
}

// Function to get CPU usage
function getCpuUsage() {
    const cpus = os.cpus();
    const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const total = cpus.reduce((acc, cpu) => acc + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq, 0);
    return ((total - idle) / total) * 100;
}

// Function to get memory usage
function getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    return ((totalMem - freeMem) / totalMem) * 100;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pingcheck')
        .setDescription('Check if the bot is up and running!'),
    async execute(interaction) {
        const system = getSystemDetails();
        const cpuUsage = getCpuUsage().toFixed(2);
        const memoryUsage = getMemoryUsage().toFixed(2);

        let message = `# The Bot Is Online!\n> Server is set up! The bot is up and running using \`node index.js\` currently running on ${system}\n> CPU Usage: ${cpuUsage}%\n> Memory Usage: ${memoryUsage}%`;
        
        if (isDocker()) {
            message = `# The Bot Is Online!\n> Server is set up! The bot is up and running in a Docker container currently running on ${system}\n> CPU Usage: ${cpuUsage}%\n> Memory Usage: ${memoryUsage}%`;
        }

        if (isKubernetes()) {
            message = `# The Bot Is Online!\n> Server is set up! The bot is up and running in a Kubernetes pod currently running on ${system}\n> CPU Usage: ${cpuUsage}%\n> Memory Usage: ${memoryUsage}%`;
        }

        await interaction.reply(message);
    },
};
