import { Client } from 'discord.js';
import ytdl from 'ytdl-core';

require('dotenv').config();

const client = new Client();

const COMMAND_PREFIX = '!';
const COMMAND_JOIN = COMMAND_PREFIX + 'join';
const COMMAND_PLAY = COMMAND_PREFIX + 'play';
const COMMAND_PAUSE = COMMAND_PREFIX + 'pause';
const COMMAND_STOP = COMMAND_PREFIX + 'stop';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Now even more powerful!`);
});

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.on('message', (msg) => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!msg.guild) return;

  const msgSubs = msg.content.split(' ');

  if (msg.content.startsWith(COMMAND_PLAY)) {
    // Only try to join the sender's voice channel if they are in one themselves
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel
        .join()
        .then((connection) => {
          // Connection is an instance of VoiceConnection
          msg.reply('I have successfully connected to the channel!');
          if (msgSubs[1] != null) {
            ytdl.getInfo(msgSubs[1], (err, info) => {
              msg.reply(`Begin playing: "${info.title}"`);
              if (err) {
                msg.reply(`Error ${err}`);
              }
            });
            connection.playStream(ytdl(msgSubs[1]));
          } else msg.reply('Please give something for me to play.');
        })
        .catch(console.log);
    } else {
      msg.reply('You need to join a voice channel first!');
    }
  }
});

client.login(process.env.TOKEN);
