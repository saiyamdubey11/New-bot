const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(port, () => console.log(`KeepAlive server started on port ${port}`));

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: 'Keosmos.aternos.me',
    port: 59291,
    username: 'Bot123'
  });

  bot.once('spawn', () => {
    console.log('Bot has spawned');

    // Circle movement
    let angle = 0;
    setInterval(() => {
      angle += Math.PI / 16;
      const radius = 5;
      const x = bot.entity.position.x + radius * Math.cos(angle);
      const z = bot.entity.position.z + radius * Math.sin(angle);
      const y = bot.entity.position.y;
      bot.pathfinder.setGoal(new mineflayer.pathfinder.goals.GoalBlock(Math.floor(x), Math.floor(y), Math.floor(z)));
    }, 4000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message.toLowerCase().startsWith('go')) {
      const parts = message.split(' ');
      if (parts.length === 2) {
        const coords = parts[1].split(',').map(Number);
        if (coords.length === 3) {
          bot.chat(`Going to ${coords.join(', ')}`);
          bot.pathfinder.setGoal(new mineflayer.pathfinder.goals.GoalBlock(...coords));
        } else {
          bot.chat('Please provide 3 coordinates like Go x,y,z');
        }
      }
    }
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });
}

const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
mineflayer.pathfinder = { pathfinder, Movements, goals };
createBot();
