const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const sortBtn = document.getElementById("sortTransactions");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";
  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
  <span>${transaction.description}</span>
  <span>${transaction.amount.toFixed(2)}$
  <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  </span>`;

  return li;
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateTransactionList();
  updateSummary();
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach((t) => {
    t.amount > 0 ? (totalIncome += t.amount) : (totalExpense -= t.amount);
  });
  incomeAmountEl.textContent = `$${totalIncome.toFixed(2)}`;
  expenseAmountEl.textContent = `$${totalExpense.toFixed(2)}`;
  let balance = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  balanceEl.textContent = `$${balance.toFixed(2)}`;
}

let ascending = true;

sortBtn.addEventListener("click", () => {
  transactions.sort((a, b) =>
    ascending ? a.amount - b.amount : b.amount - a.amount
  );

  ascending = !ascending; // flip the direction next time

  updateTransactionList();
});

// initial render
updateTransactionList();
updateSummary();
