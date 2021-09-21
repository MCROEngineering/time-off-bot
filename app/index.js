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
const { credentials } = require('./constants/credentials');

const port = 3000;
const botName = 'time-off-bot';
const channel = 'timeoff-bot-test';
const token = 'xoxb-127110982515-2508655825140-F9dakY81bnAdfPRDijC0oKxE';

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
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const queryURL = new urlParse(req.url);
  const code = queryParse.parse(queryURL.query).code;

  const oauth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  const tokens = await oauth2Client.getToken(code);
  const accessToken = tokens.tokens.access_token;

  oauth2Client.setCredentials({ access_token: accessToken });

  addEvent(oauth2Client, 'Just a test','2021-09-25T00:00:00','2021-09-26T23:59:59')
});

// Bot Actions

bot.on("start", () => {
  bot.postMessageToChannel(channel, 'Hello world!');
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

      console.log('startDate ------------------->> ', startDate);
      console.log('endDate ------------------->> ', endDate);

      // authorize(credentials.web, userName);

    } catch (error) {
      console.log('Well, that was unexpected. ' + error);
    }
  })();
});

app.listen((port), () => console.log(`<<----- APP is listening on port ${port} ----->>`));
