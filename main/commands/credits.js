const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Credits and donations page.');

function run({ interaction }) {
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
        
    interaction.reply({ embeds: [embed] });
}

module.exports = { data, run };