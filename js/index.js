const tasks = [
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: null, time: 0},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: 'Pinflag', time: 0},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: 'Cardda', time: 0},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: 'Platanus', time: 0},
  {name: 'Create my first todo (hit the "New Todo" button down there)', project: null, time: 0},
]

const tasksContainer = document.getElementById('tasks-container');
tasks.forEach((task) => {
  const child = document.createElement('div');
  tasksContainer.appendChild(child);
})
