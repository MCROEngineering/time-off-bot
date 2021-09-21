const { google } = require('googleapis');
const open = require('open');

const calendarId = 'mcro-e.com_ijciqv7comrd3lt70ab2jfhlu0@group.calendar.google.com';
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const authorize = (credentials, userName) => {
  const { client_id, client_secret, redirect_uris } = credentials;

  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: {
      client_id: userName
    }
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
      'dateTime': start_date,
      'timeZone': 'Europe/Bucharest',
    },
    'end': {
      'dateTime': end_date,
      'timeZone': 'Europe/Bucharest',
    }
  };

  const calendar = google.calendar({version: 'v3', auth});

  calendar.events.insert({
    auth: this.auth,
    calendarId: calendarId,
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
