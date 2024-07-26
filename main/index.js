//requirements
require('dotenv/config');
const cars = require('./data/cars.json')
const tracks = require('./data/tracks.json')
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, InteractionResponse } = require('discord.js');
const { CommandKit } = require('commandkit');
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

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    bulkRegister: true,
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
    console.log(interaction);

    //strategy maker command
    if (interaction.isAutocomplete() && interaction.commandName === 'strategymaker') {
        const focusedOption = interaction.options.getFocused();
        console.log(focusedValue)
        
        if (focusedOption.name === 'car') {
            const filteredChoices = cars.filter((car) =>
                car.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())
            );
    
            const results = filteredChoices.map((choice) => {
                return {
                    name: `[${choice.class}] ${choice.name}`,
                    value: choice.id,
                };
            });

            interaction.respond(results.slice(0, 25)).catch(() => {});

        } else if (focusedOption.name === 'track') {
            const filteredChoices = tracks.filter((track) =>
                track.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())
            );
    
            const results = filteredChoices.map((choice) => {
                return {
                    name: choice.name,
                    value: choice.id,
                };
            });

            interaction.respond(results.slice(0, 25)).catch(() => {});
        };
        /*const carSelect = new StringSelectMenuBuilder()
			.setCustomId('vehicularDevice')
			.setPlaceholder('Select your car.')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('AMR V12 Vantage 2013')
					.setValue('barcelona')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('AMR V8 Vantage 2019')
					.setValue('brands')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Audi R8 LMS 2015')
					.setValue('COTA')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Audi R8 LMS Evo 2019')
					.setValue('donington')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Audi R8 LMS Evo II 2022')
					.setValue('hungaroring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Bentley Continental 2015')
					.setValue('imola')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Bentley Continental 2018')
					.setValue('indianapolis')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('BMW M6 2017')
					.setValue('kyalami')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('BMW M4 2021')
					.setValue('lagunaseca')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Emil Frey Jaguar 2012')
					.setValue('misano')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Ferrari 488 2018')
					.setValue('bathurst')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Ferrari 488 EVO 2020')
					.setValue('monza')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Ferrari 296 2023')
					.setValue('nurburgring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Honda NSX GT3 2017')
					.setValue('nordschleife')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Honda NSX Evo GT3 2019')
					.setValue('oulton')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Lamborghini Huracan GT3 2015')
					.setValue('paulricard')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Lamborghini Huracan Evo GT3 2019')
					.setValue('rbr')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Lamborghini Huracan EVO2 GT3 2023')
					.setValue('silverstone')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Lexus RC F GT3 2016')
					.setValue('snetterton')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('McLaren 650S GT3 2015')
					.setValue('spa')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('McLaren 720S GT3 2019')
					.setValue('suzuka')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('McLaren 720s Evo GT3 2023')
					.setValue('valencia')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Mercedes AMG GT3 2015')
					.setValue('watkins')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Mercedes AMG Evo GT3 2020')
					.setValue('zandvoort')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Nissan GTR Nismo GT3 2015')
					.setValue('zolder')
                    .setEmoji('1196286296843354141'),
                    new StringSelectMenuOptionBuilder()
					.setLabel('Nissan GTR Nismo GT3 2018')
					.setValue('spa')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 911 GT3 R 2018')
					.setValue('suzuka')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 911 II GT3R 2019')
					.setValue('valencia')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 992 GT3R 2023')
					.setValue('watkins')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Reiter Engineering R-EX GT3 2017')
					.setValue('zandvoort')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Alpine A110 2018')
					.setValue('hungaroring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('AMR V8 Vantage 2018')
					.setValue('imola')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Audi R8 LMS 2018')
					.setValue('indianapolis')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('BMW M4 2018')
					.setValue('kyalami')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Chevrolet Camaro R 2017')
					.setValue('hungaroring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Ginetta G55 2012')
					.setValue('imola')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('KTM X-Bow 2016')
					.setValue('indianapolis')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Maserati Granturismo MC 2016')
					.setValue('hungaroring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('McLaren 570S 2016')
					.setValue('imola')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Mercedes AMG 2016')
					.setValue('indianapolis1')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 718 Cayman Clubsport 2019')
					.setValue('kyalami1')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Audi R8 LMS GT2')
					.setValue('hungaroring1')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('KTM X-Bow GT2 ')
					.setValue('imola1')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Maserati MC20 GT2')
					.setValue('indianapolis2')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Mercedes-AMG GT2')
					.setValue('hungaroring2')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 991 II GT2 RS CS Evo')
					.setValue('imola2')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 935 GT2')
					.setValue('indianapolis')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Ferrari 488 Challenge Evo 2020')
					.setValue('hungaroring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Lamborghini Huracan Super Trofeo 2015')
					.setValue('imola')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Lamborghini Huracan Super Trofeo Evo 2 2021')
					.setValue('indianapolis3')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 911 II GT3 Cup 2017')
					.setValue('kyalami3')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Porsche 911 GT3 Cup (992) 2021')
					.setValue('kyalami4')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('BMW M2 CS 2020')
					.setValue('kyalami5')
                    .setEmoji('1196286296843354141'),
			);
        
        const trackSelect = new StringSelectMenuBuilder()
			.setCustomId('track')
			.setPlaceholder('Select the track.')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Barcelona')
					.setValue('barcelona')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Brands Hatch')
					.setValue('brands')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('COTA')
					.setValue('COTA')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Donington Park')
					.setValue('donington')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Hungaroring')
					.setValue('hungaroring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Imola')
					.setValue('imola')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Indianapolis')
					.setValue('indianapolis')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Kyalami')
					.setValue('kyalami')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Laguna Seca')
					.setValue('lagunaseca')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Misano')
					.setValue('misano')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Mount Panorama')
					.setValue('bathurst')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Monza')
					.setValue('monza')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Nürburgring')
					.setValue('nurburgring')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Nürburgring 24h')
					.setValue('nordschleife')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Oulton Park')
					.setValue('oulton')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Paul Ricard')
					.setValue('paulricard')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Red Bull Ring')
					.setValue('rbr')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Silverstone')
					.setValue('silverstone')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Snetterton')
					.setValue('snetterton')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Spa Francorchamps')
					.setValue('spa')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Suzuka')
					.setValue('suzuka')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Valencia')
					.setValue('valencia')
                    .setEmoji('1196286296843354141'),
                new StringSelectMenuOptionBuilder()
					.setLabel('Watkins Glen')
					.setValue('watkins')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Zandvoort')
					.setValue('zandvoort')
                    .setEmoji('1196286296843354141'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Zolder')
					.setValue('zolder')
                    .setEmoji('1196286296843354141'),
			);

        const confirm = new ButtonBuilder()
            .setCustomId('submit')
            .setLabel('Submit')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);
        
        const cars = new ActionRowBuilder()
            .addComponents(carSelect);

        const tracks = new ActionRowBuilder()
            .addComponents(trackSelect);

        const buttons = new ActionRowBuilder()
            .addComponents(cancel, confirm);
        
        const vehicularDevice = interaction.options.getUser('vehicularDevice');
        const track = interaction.options.getString('track');

        await interaction.reply({
            content: 'Not available yet.', 
            components: [cars, tracks, buttons],
        });*/ 
    }

    /*//ping test command
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
    }*/
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