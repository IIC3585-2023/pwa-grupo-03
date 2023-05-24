const startTimer = (timeText, task, firebaseId) => {
  const times = timeText.innerHTML.split(':');
  let [hours, minutes, seconds] = [parseInt(times[0]), parseInt(times[1]), parseInt(times[2])];
  clearInterval();
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
      const taskName = task.querySelector('.task-name').innerHTML;
      showNotification(`Your task ${taskName} is completed!`, 'Take a break!');
      addCompletedStyle(task);
      updateTime(firebaseId, true, timeText.innerHTML);
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
  try {
    clearInterval(interval);
  } catch (error) {
    console.log(error);
  }
}

function showNotification(title, message) {
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body: message,
      icon: 'images/icon.svg',
      vibrate: [200, 100, 200, 100, 200, 100, 200]
    });
  });
}

function calculateTimeDifference(initialTime, time) {
    const [initialHours, initialMinutes, initialSeconds] = initialTime.split(':');
    const [hours, minutes, seconds] = time.split(':');
    
    const initialTotalSeconds = convertToSeconds(initialHours, initialMinutes, initialSeconds);
    const totalSeconds = convertToSeconds(hours, minutes, seconds);

    const usedSeconds = initialTotalSeconds - totalSeconds;

    return convertToTimeFormat(usedSeconds);
}

function convertToSeconds(hours, minutes, seconds) {
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}

function convertToTimeFormat(seconds) {
    const remainingSeconds = seconds % 60;
    const minutes = Math.floor(seconds / 60) % 60;
    const hours = Math.floor(seconds / 3600);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function convertTimeToMinutes(time) {
    const [hours, minutes, seconds] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes) + Math.ceil(parseInt(seconds) / 60);
}

function calculateMinutesSpent(times) {
  const groupedProjects = {};
  times.map(item => {
      const { project, time, initialTime } = item;
      const usedTime = calculateTimeDifference(initialTime, time);
      if (groupedProjects.hasOwnProperty(project)) {
          groupedProjects[project] += convertTimeToMinutes(usedTime);
      } else {
          groupedProjects[project] = convertTimeToMinutes(usedTime);
      }   
  });

  return groupedProjects
}
