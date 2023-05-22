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
      showNotification();
      addCompletedStyle(task);
      updateTime(firebaseId, true);
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

function createNotification(title, message) {
  // return new Notification(title, {
  //   body: message,
  //   icon: './images/icon.svg',
  // });
}

function showNotification() {
//   self.registration.showNotification('Vibration Sample', {
//     body: 'Buzz! Buzz!',
//     icon: './images/icon.svg',
//     vibrate: [200, 100, 200, 100, 200, 100, 200],
//     tag: 'vibration-sample'
//   });
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification("Notificacion", {
      body: "Buzz! Buzz!",
    });
  });
}