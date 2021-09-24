const timeOffMsg = [
  'Time Off Request',
  'Time off request',
  'time off request'
];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const presentationMsg = `Hi! :wave: I'm your new assistant for taking days off. \n
  Anytime you want a day off you should use one of the following command so i can add you in the Calendar. \n
  1. COMMAND: MONTH DAY, YEAR - MONTH DAY, YEAR \n
  2. COMMAND: MONTH DAY - MONTH DAY \n
  3. COMMAND: MONTH DAY \n
  \n
  Where:\n
  COMMAND can be one of the following: Time Off Request, Time off request or time off request.
  MONTH can be one of the following: January, Jan, February, Feb, March, Mar, April, Apr, May, June, Jun, July, Jul, August, Aug, September, Sep, October, Oct, November, Nov, December, Dec. \n
  \n
  ENJOY YOUR DAY OFF! :party_parrot:
  `;

module.exports = {
  timeOffMsg,
  shortMonths,
  months,
  presentationMsg
};
