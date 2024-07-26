const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('A help menu.');

function run({ interaction }) {
    const embed = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTitle('Help Menu')
            .setDescription('This is the help menu of Setup Engineer')
            .setTimestamp()
            //.setThumbnail('logo Wlink')
            .setFooter({ text: `Requested by - ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL()}` })
            .addFields(
                { name: 'Help', value: 'Shows this page.\n' },
                { name: 'FuelCalculator', value: 'Functionnal (time format checkers not implemented)', inline: true },
                { name: 'StrategyMaker', value: 'Work in progress (autocomplete).', inline: true },
                { name: 'SetupEngineer', value: 'Not available.', inline: true },
            )
            .addFields(
                { name: 'Credits', value: 'Shows the credits and donation page.', inline: true },
                { name: 'Ping', value: 'Pong!', inline: true },
            )
        
    interaction.reply({ embeds: [embed] });
}

module.exports = { data, run };