const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('fuelcalculator')
    .setDescription('Allows you to calculate the necessary amount of fuel for a race.');

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

function run({ interaction }) {
    //rework time format checks l. 20, 21 & addZero function (2.4h format but also 2h24)
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
        
    interaction.reply({ embeds: [embed] });
}

module.exports = { data, run };