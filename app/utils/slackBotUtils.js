const {
  timeOffMsg
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

const getDates = (text) => {
  const commandsArray = text.split(':');
  if (!timeOffMsg.includes(commandsArray[0])) throw 'You have to use one of the following commands: Time Off Request, Time off request, time off request';
  if (!commandsArray[1]) throw 'You have to specify the dates you want to be off.'

  const datesArray = commandsArray[1].split('-');
  const startDate = datesArray[0];

  const endDate = datesArray[1] ? '' : startDate

  return ({
    startDate: '',
    endDate: ''
  });
};

module.exports = {
  getUserName,
  getDates
};
