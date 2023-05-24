Chart.defaults.global.legend.display = false;

const data = {
  University: 83,
  Cardda: 108,
  Platanus: 86,
  Pinflag: 17
}

const colors = [
  '#9900EF',
  '#FF6900',
  '#00D084',
  '#0693E3',
  '#FCB900',
  '#EB144C',
  '#8ED1FC',
  '#F78DA7',
  '#9FD4A6',
  '#F0F3F4',
  '#F0B27A',
  '#95A5A6',
  '#95A5A6',
  '#D7BDE2'
]

// select random objects without repetition
const randomObjects = (array, n) => {
  const result = new Array(n);
  let len = array.length;
  const taken = new Array(len);
  while (n--) {
    const selected = Math.floor(Math.random() * len);
    result[n] = array[selected in taken ? taken[selected] : selected];
    taken[selected] = --len in taken ? taken[len] : len;
  }
  return result;
}

function createChart(data) {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: randomObjects(colors, Object.keys(data).length),
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      title: {
        display: true,
        text: 'Time in projects (in minutes)',
        fontSize: 13,
        fontColor: '#FFF',
        padding: 20,
        position: 'bottom',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  });
}

getTimes().then((data) => {
  const { groupedTimes } = data
  const chartLabels = Object.keys(groupedTimes)
  const chartData = Object.values(groupedTimes)

  createChart(groupedTimes)
});