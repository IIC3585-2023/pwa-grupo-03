const playIcon = '<span class="time-button-icon"><svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path clip-rule="evenodd" fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"></path></svg></span>'
const stopIcon = '<span class="time-button-icon"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg></span>';
const checkIcon = '<span class="check-icon"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n' +
  '  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>\n' +
  '</svg></span>'
const numberToDayOfWeek = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}

const createElements = (isInput) => {
  const rightSection = document.createElement('div');
  const leftSection = document.createElement('div');
  const taskName = document.createElement(isInput ? 'input' : 'h1');
  const checkbox = document.createElement('button');

  const project = document.createElement(isInput ? 'input' : 'p');
  const textSection = document.createElement('div');
  const timeSection = document.createElement('div');
  const timeButton = document.createElement('button');
  const timeText = document.createElement(isInput ? 'input' : 'p');

  return {
    rightSection,
    leftSection,
    taskName,
    checkbox,
    project,
    textSection,
    timeSection,
    timeButton,
    timeText,
  }
}

const appendChildren = (child, {textSection, leftSection, taskName, project, checkbox, timeButton, timeSection, timeText, rightSection}) => {
  textSection.appendChild(taskName);
  textSection.appendChild(project);
  leftSection.appendChild(checkbox);
  leftSection.appendChild(textSection);

  timeSection.appendChild(timeButton);
  timeSection.appendChild(timeText);
  rightSection.appendChild(timeSection);

  child.appendChild(leftSection);
  child.appendChild(rightSection);
  return child;
}

const addStyles = (isInput, child, {textSection, leftSection, taskName, project, checkbox, timeButton, timeSection, timeText, rightSection}) => {
  child.classList.add('task');
  rightSection.classList.add('flex', 'items-center')
  leftSection.classList.add('flex', 'items-start', 'pointer-events-none')
  taskName.classList.add(isInput ? 'task-input' : 'task-name');
  project.classList.add(isInput ? 'task-input-project' : 'task-project');
  checkbox.classList.add('task-checkbox');
  textSection.classList.add('text-section');
  timeSection.classList.add('time-section');
  timeButton.classList.add('time-button');
  timeText.classList.add(isInput ? 'time-text-input' : 'time-text');
  timeButton.innerHTML = playIcon;
}

const taskElement = (isInput, task, index) => {
  const child = document.createElement(isInput ? 'button' : 'div');
  const elements = createElements(isInput);
  const {
    taskName,
    project,
    checkbox,
    timeButton,
    timeText,
  } = elements;
  const elementsInside = Object.values(elements);

  addStyles(isInput, child, elements);

  appendChildren(child, elements);

  if (isInput) {
    child.tabIndex = -1;
    child.addEventListener('blur', (e) =>{
      child.dataset.blurTimeout = setTimeout(onblurNewTask, 0)
    });
    elementsInside.forEach((element) => {
      element.tabIndex = 0;
      element.addEventListener('focus', () => {
        clearTimeout(child.dataset.blurTimeout);
      });
    });

    taskName.placeholder = 'Name';
    project.placeholder = 'Project';
    timeText.value = '00:00:00';
    checkbox.disabled = true;
    timeButton.disabled = true;
  }
  else {
    if (task?.completed) addCompletedStyle(child);
    taskName.innerHTML = task.name;
    project.innerHTML = task.project || 'No project';
    timeText.innerHTML = task.time;
    checkbox.disabled = false;
    timeButton.disabled = false;
    timeButton.id = `time-button-${index + 1}`;
    timeText.id = `time-text-${index + 1}`;

    handleTimer(child, task.id);
    handleComplete(child, task.id);
  }

  return child;
}

const createTasksContainers = (tasks) => {
  const tasksContainer = document.getElementById('tasks-container');
  tasks.forEach((task, index) => {
    const child = taskElement(false, task, index);
    tasksContainer.appendChild(child);
  })
  const tasksNumber = document.getElementById('tasks-number');
  tasksNumber.innerHTML = tasks.length;
}

const handleTimer = (task, firebaseId) => {
  const timeButton = task.querySelector('.time-button');
  const timeText = task.querySelector('.time-text');
  timeButton.addEventListener('click', () => {
    if (timeButton.innerHTML === playIcon) {
      timeButton.innerHTML = stopIcon;
      const interval = startTimer(timeText, task, firebaseId);
      timeButton.interval = interval;
    } else {
      timeButton.innerHTML = playIcon;
      stopTimer(timeButton.interval);
    }
  });
}
const changeDateElements = () => {
  const dateNumber = document.getElementById('date-number');
  const dateDay = document.getElementById('date-day');
  const today = new Date();
  dateNumber.innerHTML = today.getDate();
  dateDay.innerHTML = numberToDayOfWeek[today.getDay()];
}

const createNewTask = () => {
  const tasksContainer = document.getElementById('tasks-container');
  const newTask = taskElement(true, null);
  tasksContainer.appendChild(newTask);
}

const onblurNewTask = () => {
  const tasksContainer = document.getElementById('tasks-container');
  const lastTask = tasksContainer.lastChild;
  const name = lastTask.querySelector('.task-input').value;
  const time = lastTask.querySelector('.time-text-input').value;
  const project = lastTask.querySelector('.task-input-project').value;
  
  let task = { name, time, project, completed: false };
  createTime(task);
  getTimes().then((data) => {
    const { times } = data
    task = {...task, id: _.last(times)?.id}
  })

  tasksContainer.removeChild(lastTask);
  const newTask = taskElement(false, task, tasksContainer.children?.length);
  tasksContainer.appendChild(newTask);
}

const handleComplete = (task, firebaseId) => {
  const checkbox = task.querySelector('.task-checkbox');
  checkbox.addEventListener('click', () => {
    addCompletedStyle(task);
    const timeText = task.querySelector('.time-text').innerHTML;
    console.log('🥵🍆💦 ~ file: dom.js:183 ~ checkbox.addEventListener ~ timeText:', timeText)
    updateTime(firebaseId, true, timeText);
  })
}

const addCompletedStyle = (task) => {
  const checkbox = task.querySelector('.task-checkbox');
  checkbox.innerHTML = checkIcon;
  task.classList.add('completed');
}

getTimes().then((data) => {
  const { times, groupedTimes } = data
  const chartLabels = Object.keys(groupedTimes)
  const chartData = Object.values(groupedTimes)

  createTasksContainers(times)
});
changeDateElements();

const newTaskButton = document.getElementById('new-task');
newTaskButton.addEventListener('click', createNewTask);
