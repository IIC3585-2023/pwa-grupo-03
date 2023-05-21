const startTimer = (timeText) => {
  const times = timeText.innerHTML.split(':');
  let [hours, minutes, seconds] = [parseInt(times[0]), parseInt(times[1]), parseInt(times[2])];
  const interval = setInterval(() => {
    seconds--;
    if (seconds === -1) {
      seconds = 59;
      minutes--;
    }
    if (minutes === 59 && seconds === 59) {
      hours--;
    }
    if (hours === 0 && minutes === 0 && seconds === 0) {
      hours = 0;
      minutes = 0;
      seconds = 0;
      createNotification('Time is up!', 'You have been working a lot, take a break!')
      stopTimer(interval);
    }
    timeText.innerHTML = `${showTime(hours)}:${showTime(minutes)}:${showTime(seconds)}`;
  }, 1000);
  return interval;
}

const showTime = (time) => {
  if (time < 10) {
    return `0${time}`;
  }
  return time;
}

const stopTimer = (interval) => {
  clearInterval(interval);
}