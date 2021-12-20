//These are the variables that are used in the app
var balance = document.getElementById('balance');
var add_money = document.getElementById('money-plus');
var subtract_money = document.getElementById('money-minus');
var list = document.getElementById('list');
var form = document.getElementById('form');
var text = document.getElementById('text');
var figure = document.getElementById('figure');

//Pie chart static data
var xValues = ["My Balance", "Book", "Pen", "Eraser", "Pencil", "Ruler"];
var yValues = [44, 25, 15, 10, 5,1];
var barColors = [
  "#A52A2A",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];

new Chart("myChart", {
  type: "doughnut",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "My Transaction Pie chart"
    }
  }
});

//save and retain records in the browser local storage
var localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add new transaction
function addTransaction(obj) {
  obj.preventDefault();
  
//In case no input or an invalid input in the transaction details and amount text box
  if (text.value.trim() === '' || figure.value.trim() === '') {
    alert('Please add Transaction Details and Tansaction Amount');
  } else {
    var transaction = {
// id will be generated by the function autogenerateID	
      id: autogenerateID(),
      text: text.value,
      figure: +figure.value
    };

    transactions.push(transaction);

    addTransaction_HistoryList(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    figure.value = '';
  }
}

// This function will generate random ID for the addTransaction fuction
function autogenerateID() {
  return Math.floor(Math.random() * 1000);
}

// Add transactions to HistoryList
function addTransaction_HistoryList(transaction) {
  // Get sign
  var sign = transaction.figure < 0 ? '-' : '+';

  var item = document.createElement('li');

// Add class based on value
  item.classList.add(transaction.figure < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.figure
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  var figures = transactions.map(transaction => transaction.figure);

  var total = figures.reduce((acc, item) => (acc += item), 0).toFixed(2);

  var income = figures
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  var expense = (figures.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `Rs${total}`;
  add_money.innerText = `Rs${income}`;
  subtract_money.innerText = `Rs${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update and save local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init function will clear and add new data in the history list
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransaction_HistoryList);
  updateValues();
}

//call the init function and submit transaction to be displayed and saved
init();

form.addEventListener('submit', addTransaction);