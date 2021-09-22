const { google } = require('googleapis');
const open = require('open');

const { config } = require('../constants/config');

const authorize = () => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uri);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.scopes
  });

  open(authUrl);
}

const listEvents = (auth) => {
  const calendar = google.calendar({version: 'v3', auth});

  calendar.events.list({
    calendarId: calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);

    const events = res.data.items;

    if (events.length) {
      console.log('Upcoming 10 events:');

      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
};

const addEvent = (auth, summary, start_date, end_date) => {
  const event = {
    'summary': summary,
    'start': {
      'date': start_date,
      'timeZone': 'Europe/Bucharest',
    },
    'end': {
      'date': end_date,
      'timeZone': 'Europe/Bucharest',
    }
  };

  const calendar = google.calendar({version: 'v3', auth});

  calendar.events.insert({
    auth: this.auth,
    calendarId: process.env.CALENDAR_ID,
    resource: event,
  }, (err, event) => {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created');
  });
};

module.exports = {
  authorize,
  addEvent,
  listEvents
};
