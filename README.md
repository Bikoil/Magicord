<p align="center">
<img src="https://github.com/Bikoil/Magicord/assets/139659047/a03b7e72-bba5-4a68-9dc8-ada44bef49bf" alt="alt text" width="100px">
</p>
<h1 align="center">
  Magicord
</h1>
<div align="center">
<em> An Open Source Discord Bot Written in JavaScript </em>
</div>
  
<p align="center">
<img src="https://img.shields.io/badge/Discord.js-Bot-Bot?style=for-the-badge"> 
<img src="https://img.shields.io/github/commit-activity/w/Bikoil/Magicord/main?style=for-the-badge">  
<img src="https://img.shields.io/badge/WorkInProgress-JS?style=for-the-badge">

</p>






***
***


# What is Magicord?
- Magicord used to be a bot primarily hosted on [Botghost](https://botghost.com) but since it was unreliable and had limitations, I decided to move it to [Discord.js](https://discord.js.org), everything is still being moved so not everything has been added here.
# Features
- Modern reaction roles
- Setup applications as an alternative to google forms
- Safety system against raids
- Configuration to your liking 
- Edit the bot's code to your liking! (Need js knowledge)

__NOTE THAT MOST OF THESE FEATURES HAVE NOT BEEN IMPLEMENTED YET__

***

# How to setup the bot
> [!IMPORTANT]  
> Before setting up the bot, you must have at least some javascript skill or are familliar with the language, do not open issues on learning javascript or "where do i begin from", please look at [Discord.js guide](https://discordjs.guide) for more information about discord.js, you may also learn javascript at the[JavaScript website](https://www.javascript.com/), Also, you may need to have some knowledge about the terminal and how to use it including bash and other shells.
> Please also Keep in mind this bot is not complete at all, and is still being worked on.


- Firstly, you will have to clone this repository using git or gh cli, if you plan on using git for long term purpose (as in a project) then you may want to keep using git after cloning.

- *"How do i clone a repository?"*
 - You have 2 options to clone the repository, either by using git as listed ealier or by forking the repository then using github desktop, i recommend using git, but if you aren't experienced with terminals and such, you may use github desktop.

 ## Cloning the repository using git cli

- Run the following command in git bash or in terminal (if you are using windows), this guide should work perfectly with linux systems and unix systems (like MacOS and FreeBSD)

You may not have git installed by default, so, install it depending on the OS

Another thing you will have to install is npm (Node Package Manager) for JS, or node

### Windows

to install git on windows you can either run this in command prompt

```bash
winget install git
# to install npm
winget install npm
# if npm doesnt work install node
winget install node
```

or by installing it from [The official git website](https://git-scm.com/)

### Linux Distros

- **Debian**
```bash
sudo apt install git
# to install npm
sudo apt install node
```
- **Arch Linux**
```bash
sudo pacman -S git
# to install npm
sudo pacman -S node npm
```
- **Fedora**
```bash
sudo dnf install git
# to install npm
sudo dnf install npm
# if that doesnt work
sudo dnf install node
```

If you are using any other distro, you should be able to do it on your own

### MacOS/FreeBSD

- **MacOS**

Firstly, install [Homebrew](https://brew.sh/) if you haven't yet
```bash
brew install git
# to install npm
brew install npm
# if it doesnt work
brew install node
```

- **FreeBSD**
```bash
sudo pkg install git
# to install npm
sudo pkg install npm
# if that doesnt work
sudo pkg install node
```
> [!IMPORTANT]
> This part of the guide needs YOUR Help in adjusting since most of this OS's were not experimented when installing the packages, if there is any mistake within this part, please open a pull request/issue correcting it, the tested OS's are
> - Arch Linux
> - Debian
> I would heavily appreciate your corrections on this part, thank you


***

With git installed now its time to clone the repository

```bash
git clone https://github.com/bikoil/Magicord
```

If you forked the repository, then you should do the following instead

```bash
git clone https://github.com/<YourUsername>/<YourMagicordForkName>
```

Now, your bot repository is setup in your device, you are missing 2 more steps before the bot is setup

# Setting the bot up with your bot token

> [!IMPORTANT]
> NEVER ever give your bot token to absolutely ANYONE, giving your bot token to anyone or leaking it can cause **catostrophic events** to your bot and the servers it is inside, leaking it essentially gives the person access to the bot and do absolutely anything you want, this is fully YOUR responsibility and you should take care of it.

Now, you can either keep going with the terminal to setup everything if you are used to the terminal, you will have to make 2 files in the bot folder

- Go to your bot folder
- Make 2 files named `.env` and `config.json`
> [!IMPORTANT]
> If you are hosting your bot on a public git platform (like github or gitlab) then DO NOT delete the `.gitignore` file as it prevents your token from being leaked and stops config.json and .env from appearing on the public git repository

- Copy this to the `config.json`
```json
{
	"token": "<YourBotToken>",
	"clientId": "YourBot'sClientID",
	"guildId": "YourServerID"
}
```
> [!IMPORTANT]
> This step may be changed soon in the future.

- Copy this for the `.env` 
```env
A=123 
B=456 
DISCORD_TOKEN=YourBotToken node index.js
```
After this, you are all set! you just need to do the following to run the ot and make it online

- Go to your terminal/command prompt
- change directory to the bot folder
```bash
cd <TheBotFolderName>
```

- and finally run
```bash
node deploy-commands.js
```
then
```bash
node index.js
```

And viola! your bot is online, now you can go ahead and customize it all you want

> Please remember, if there are any issues in the guide, please open a pull request/issue, i would really appreciate your help, so thank you.


*Original dev team that made this: !!Cords!!, this dev team is not public yet*




