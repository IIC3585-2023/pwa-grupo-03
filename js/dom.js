const tasks = [
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: null, time: '00:00:00'},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: 'Cardda', time: '00:00:00'},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: 'Platanus', time: '00:00:00'},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: null, time: '00:00:00'},
]

const playIcon = '<span class="time-button-icon"><svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path clip-rule="evenodd" fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"></path></svg></span>'
const stopIcon = '<span class="time-button-icon"><svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"></path></svg></span>';
const numberToDayOfWeek = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}

const createTasksContainers = (tasks) => {
  const tasksContainer = document.getElementById('tasks-container');
  tasks.forEach((task) => {
    const child = document.createElement('div');
    const rightSection = document.createElement('div');
    const leftSection = document.createElement('div');
    const taskName = document.createElement('h1');
    const checkbox = document.createElement('button');
    const project = document.createElement('p');
    const textSection = document.createElement('div');
    const timeSection = document.createElement('div');
    const timeButton = document.createElement('button');
    const timeText = document.createElement('p');

    child.classList.add('task');
    rightSection.classList.add('flex', 'items-center')
    leftSection.classList.add('flex', 'items-start')
    taskName.classList.add('task-name');
    project.classList.add('task-project');
    checkbox.classList.add('task-checkbox');
    textSection.classList.add('text-section');
    timeSection.classList.add('time-section');
    timeButton.classList.add('time-button');
    timeText.classList.add('time-text');

    taskName.innerHTML = task.name;
    project.innerHTML = task.project || 'No project';
    timeText.innerHTML = task.time;
    timeButton.innerHTML = playIcon;

    textSection.appendChild(taskName);
    textSection.appendChild(project);
    leftSection.appendChild(checkbox);
    leftSection.appendChild(textSection);

    timeSection.appendChild(timeButton);
    timeSection.appendChild(timeText);
    rightSection.appendChild(timeSection);

    child.appendChild(leftSection);
    child.appendChild(rightSection);
    tasksContainer.appendChild(child);
  })
}

const changeDateElements = () => {
  const dateNumber = document.getElementById('date-number');
  const dateDay = document.getElementById('date-day');
  const today = new Date();
  dateNumber.innerHTML = today.getDate();
  dateDay.innerHTML = numberToDayOfWeek[today.getDay()];
}

createTasksContainers(tasks);
changeDateElements();