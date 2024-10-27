function getTime(startTime, endTime, startMeets, spanMeets) {
  const minutesInHour = 60;

  const times = [startTime, endTime, startMeets, spanMeets];
  const convertMinutes = [];

  for (let i = 0; i < times.length - 1; i++) {
    const time = times[i];
    let [hours, minutes] = time.split(':');
    if (hours[0] === 0) {
      hours = hours.replace('0', '');
    }
    if (minutes[0] === 0) {
      minutes = minutes.replace('0', '');
    }
    convertMinutes.push(hours * minutesInHour + minutes * 1);
  }
  const endMeets = convertMinutes[convertMinutes.length - 1] + spanMeets;

  if (convertMinutes[0] <= endMeets && endMeets <= convertMinutes[1]) {
    return true;
  }
  return false;
}

getTime('08:00', '17:30', '14:00', 90); // true
getTime('8:0', '10:0', '8:0', 120); // true
getTime('08:00', '14:30', '14:00', 90); // false
getTime('14:00', '17:30', '08:0', 90); // false
getTime('8:00', '17:30', '08:00', 900); // false
