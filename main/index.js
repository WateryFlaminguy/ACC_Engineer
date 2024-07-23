//requirements
require('dotenv/config');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { OpenAI } = require('openai');

//define client 
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

//signals when bot online
client.on('ready', (bot) => {
    console.log(`${bot.user.username} is online.`);
});

//prefix for chatting with the AI
const PREFIX = "."

//define ai
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

//functions
function addZero(time) {
    let timeSeconds = time[1]?.split('.');
    if (timeSeconds[0].length < 2) {
        for (let i = 0; i < 2-timeSeconds[0].length; i++) {
            timeSeconds[0] = '0' + timeSeconds[0];
        }   
    }
    time[1] = timeSeconds?.join();
    return time;
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    //ping test command
    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    //help command
    if (interaction.commandName === 'help') {
        const embed = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTitle('Help Menu')
            .setDescription('This is the help menu of Setup Engineer')
            .setTimestamp()
            //.setThumbnail('link')
            .setFooter({ text: `Requested by - ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
            .addFields(
                { name: 'Help', value: 'Shows this page.\n' },
                { name: 'FuelCalculator', value: 'Work in progress...\n', inline: true },
                { name: 'StrategyMaker', value: 'Not available.', inline: true },
                { name: 'SetupEngineer', value: 'Not available.', inline: true },
            )
            .addFields(
                { name: 'Credits', value: 'Shows the credits and donation page.', inline: true },
                { name: 'Ping', value: 'Pong!', inline: true },
            )
        
        await interaction.reply({ embeds: [embed] });
    }

    //fuel calculator command
    if (interaction.commandName === 'fuelcalculator') {
        let raceTime = interaction.options.getString('race-time').split(':');
        let lapTime = interaction.options.getString('laptime').split(':');
        const fuelUsage = interaction.options.getNumber('fuel-usage');
        const safeLaps = interaction.options.getNumber('safe-laps') ?? 0;
        
        const [minutes, seconds] = lapTime.map(parseFloat);
        const secondsLapTime = minutes * 60 + seconds;

        raceTime = addZero(raceTime);
        lapTime = addZero(lapTime)
        
        const minutesRaceTime = Number(raceTime[0]) * 60 + Number(raceTime[1]);
        
        const laps = Math.ceil(minutesRaceTime*60/secondsLapTime);
        const minFuel = Math.ceil(laps * fuelUsage)
        const safeFuel = minFuel + Math.ceil( minFuel * 0.03 ) * safeLaps;

        let embed = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTitle('Fuel Calculator')
            .setTimestamp()
            .setFooter({ text: `Requested by - ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
            .addFields(
                { name: 'Race Time', value: `${raceTime.join()}`, inline: true },
                { name: 'Average Lap Time', value: `${lapTime}`, inline: true },
                //{ name: "\u200B", value: "\u200B" },
                { name: 'Fuel per Lap', value: `${fuelUsage} L/Lap`, inline: true },
                //{ name: '\u200b', value: '\u200b' },
                { name: 'Minimum Fuel Required', value: `${minFuel}L`, inline: true },
                { name: 'Safe fuel (+3%/lap)', value: `${safeFuel}L`, inline: true },
                { name: 'Laps', value: `${laps} Laps`, inline: true },
            )
            if (minFuel > 132 ) {
                embed.setDescription('Minimum required fuel superior to maximum car fuel capacity. Consider using the strategy maker.')
            }
        
        await interaction.reply({ embeds: [embed] });
        
    }

    //strategy maker command
    if (interaction.commandName === 'strategymaker') {
        await interaction.reply('Not available yet.');
    }

    //AI setup engineer command
    if (interaction.commandName === 'setupengineer') {
        await interaction.reply('Not available yet.');
    }

    //credits & donations command
    if (interaction.commandName === 'credits') {
        const embed = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTitle('Credits & Donations')
            .setDescription('This is the for the credits and donations of Setup Engineer')
            .setTimestamp()
            //.setThumbnail('link')
            .setFooter({ text: `Requested by - ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
            .addFields(
                { name: 'Credits', value: 'Created by Olin Carnohan\n\nInspired by u/andreasntr \'s AI Chatbot.\nInspired by the Fuelbot discord app.\nInspired by the ACC Strategist mobile app.\n' },
            )
            .addFields(
                { name: 'Donations', value: 'N/A' },
                //{ name: 'Donations', value: '[Test link](https://youtube.com)' },
            )
        
        await interaction.reply({ embeds: [embed] });
    }

    console.log(interaction);
});

//AI part using GPT 4o mini (basically ChatGPT but through discord)
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    if (message.guild.id !== process.env.GUILD_ID) return;
    //if (!message.mentions.users.has(client.user.id)) return;

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 2500);

    let conversation = [];
    conversation.push({
        role: 'system',
        content: 'ChatGPT is a friendly chatbot',
    });

    let prevMsgs = await message.channel.messages.fetch({ limit: 10 });
    prevMsgs.reverse();

    prevMsgs.forEach((msg) => {
        if (msg.author.bot && msg.author.id !== client.user.id) return;
        if (!message.content.startsWith(PREFIX)) return;

        const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (msg.author.id === client.user.id) {
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content
            });

            return;
        }

        conversation.push({
            role: 'user',
            name: username,
            content: msg.content
        });
    });

    const response = await openai.chat.completions
        .create({
            model: 'gpt-4o-mini',
            messages: conversation,
        })
        .catch((error) => console.error('OpenAI Error:\n', error));

    clearInterval(sendTypingInterval);

    if (!response) {
        message.reply("I'm having trouble with the OpenAI API. Try again in a moment.");
        return;
    }
    
    const responseMsg = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for (let i = 0; i < responseMsg.length; i += chunkSizeLimit) {
        const chunk = responseMsg.substring(i, i + chunkSizeLimit);
        
        await message.reply(chunk); 
    }
});

//start bot
client.login(process.env.TOKEN);

// format id + convo number ?