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

const taskElement = (isInput, task) => {
  const child = document.createElement(isInput ? 'button' : 'div');
  const rightSection = document.createElement('div');
  const leftSection = document.createElement('div');
  const taskName = document.createElement(isInput ? 'input' : 'h1');
  const checkbox = document.createElement('button');

  const project = document.createElement(isInput ? 'input' : 'p');
  const textSection = document.createElement('div');
  const timeSection = document.createElement('div');
  const timeButton = document.createElement('button');
  const timeText = document.createElement(isInput ? 'input' : 'p');

  const elementsInside = []
  elementsInside.push(rightSection);
  elementsInside.push(leftSection);
  elementsInside.push(taskName);
  elementsInside.push(checkbox);
  elementsInside.push(project);
  elementsInside.push(textSection);
  elementsInside.push(timeSection);
  elementsInside.push(timeButton);
  elementsInside.push(timeText);
  
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
  }
  if (!isInput) {
    taskName.innerHTML = task.name;
    project.innerHTML = task.project || 'No project';
    timeText.innerHTML = task.time;
    timeButton.innerHTML = playIcon;
  } else {
    taskName.placeholder = 'Name';
    project.placeholder = 'Project';
    timeText.value = '00:00:00';
  }
  
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
  // tasksContainer.appendChild(child);
}

const createTasksContainers = (tasks) => {
  const tasksContainer = document.getElementById('tasks-container');
  tasks.forEach((task) => {
    const child = taskElement(false, task);
    tasksContainer.appendChild(child);
  })
  const tasksNumber = document.getElementById('tasks-number');
  tasksNumber.innerHTML = tasks.length;
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
  console.log('onblurNewTask');
  return
  const tasksContainer = document.getElementById('tasks-container');
  const lastTask = tasksContainer.lastChild;
  const name = lastTask.querySelector('.task-input').value;
  const time = lastTask.querySelector('.time-text').innerHTML;
  const project = lastTask.querySelector('.task-project').innerHTML;
  const task = { name, time, project, completed: false };
  createTime(task);
  tasksContainer.removeChild(lastTask);
  const newTask = taskElement(false, task);
  tasksContainer.appendChild(newTask);
}

getTimes();
changeDateElements();

const newTaskButton = document.getElementById('new-task');
newTaskButton.addEventListener('click', createNewTask);