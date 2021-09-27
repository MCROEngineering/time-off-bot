require('dotenv').config();

const express = require('express');
const { google } = require('googleapis');
const cors  = require('cors');
const queryParse = require('query-string');
const urlParse = require('url-parse');
const bodyParser = require('body-parser');
const { WebClient } = require('@slack/web-api');
const SlackBot = require('slackbots');

const { getUserName, getDates } = require('./utils/slackBotUtils');
const { authorize, addEvent } = require('./utils/calendatUtils');

const { presentationMsg } = require('./constants/messageTemplates');

const port = 3000;
const channel = process.env.CHANNEL;
const token = process.env.BOT_TOKEN;
const botName = process.env.BOT_NAME;

let startDateGlobal = '';
let endDateGlobal = '';
let userNameGlobal = '';

const app = express();
const web = new WebClient(token);
const bot = new SlackBot({
  token: token,
  name: botName
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// App Endpoints

app.get('/getCode', async (req, res) => {
  const queryURL = new urlParse(req.url);
  const code = queryParse.parse(queryURL.query).code;

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  const tokens = await oauth2Client.getToken(code);
  const accessToken = tokens.tokens.access_token;

  oauth2Client.setCredentials({ access_token: accessToken });

  addEvent(oauth2Client, userNameGlobal, startDateGlobal, endDateGlobal)
});

// Bot Actions

bot.on("start", () => {
  bot.postMessageToChannel(channel, presentationMsg);
});

bot.on("message", (data) => {
  if (data.type !== "message" || (data.subtype && data.subtype === 'bot_message')) {
    return;
  }

  const userId = data && data.user;
  if (!userId) {
    bot.postMessageToChannel(channel, 'Sorry, I was not able to find you');
    return;
  }

  (async () => {
    try {
      const response = await web.users.info({ user: userId });

      const { user } = response;
      const userName = getUserName({ bot, channel, user });
      const { startDate, endDate } = getDates(data.text);

      userNameGlobal = userName;
      startDateGlobal = startDate;
      endDateGlobal = endDate;

      authorize();
    } catch (error) {
      bot.postMessageToChannel(channel, error);
    }
  })();
});

app.listen((port));
