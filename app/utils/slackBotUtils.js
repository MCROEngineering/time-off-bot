const {
  timeOffMsg,
  shortMonths,
  months
} = require('../constants/messageTemplates');

const getUserName = ({ bot, channel, user }) => {
  if (!user) {
    bot.postMessageToChannel(channel, 'Something went wrong!');
  }
  const { name } = user;

  const nameArray = name.split('.');

  const capitalizeNameArray = nameArray.map(name => {
    return name.charAt(0).toUpperCase() + name.substr(1);
  });

  return capitalizeNameArray.join(' ');
};

const generateDate = (date) => {
  const dateFormatted = date.replace(/,/g, '');
  const dateArray = dateFormatted.split(' ');

  if (!shortMonths.includes(dateArray[0]) && !months.includes(dateArray[0])) {
    throw 'You have to specify the month in the right way.'
  }

  const monthIndex = months.includes(dateArray[0]) ? months.indexOf(dateArray[0]) : shortMonths.indexOf(dateArray[0]);
  const monthNumber = monthIndex + 1;
  const month = monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;
  const day = dateArray[1];

  if (!day) throw 'You have to specify the day';

  const year = dateArray[2] || new Date().getFullYear();

  return `${year}-${month}-${day}`;
};

const getDates = (text) => {
  const commandsArray = text.split(':');
  if (!timeOffMsg.includes(commandsArray[0])) {
    throw 'You have to use one of the following commands: Time Off Request, Time off request, time off request';
  }
  if (!commandsArray[1]) {
    throw 'You have to specify the dates you want to be off.'
  }

  const datesArray = commandsArray[1].split('-');
  const startDate = datesArray[0];

  const startDateFormatted = generateDate(startDate.trim());
  const endDateFormatted = datesArray[1] ? generateDate(datesArray[1].trim()) : startDateFormatted;

  return ({
    startDate: startDateFormatted,
    endDate: endDateFormatted
  });
};

module.exports = {
  getUserName,
  getDates
};
