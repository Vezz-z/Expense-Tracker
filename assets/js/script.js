let allExpenses = []
const oldExpenses = localStorage.getItem('allOldExpenses')

let balance = 0
let transactionType = 'income'

const balanceDisplay = document.getElementById('balance-display')
const incomeBtn = document.getElementById('income-button')
const expenseBtn = document.getElementById('expense-button')
const resetBtn = document.getElementById('reset-button')

const dateInput = document.getElementById('date-input')
const amountInput = document.getElementById('amount-input')
const categoryInput = document.getElementById('category-input')
const addBtn = document.getElementById('add-expense-button')
const expenseTableBody = document.getElementById('transactions-table')

incomeBtn.classList.add('active')

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
const localDate = today.toISOString().split('T')[0]
dateInput.max = localDate

if (oldExpenses) {
    allExpenses = JSON.parse(oldExpenses)

    allExpenses.forEach(element => {
        const row = `
            <tr class='${element.type}'>
                <td>${element.date}</td>
                <td>${element.category}</td>
                <td>₹ ${element.amount}</td>
            </tr>
        `
        expenseTableBody.innerHTML += row

        balance = element.type === 'income' ? balance + element.amount : balance - element.amount
    })
    balanceDisplay.textContent = `Balance: ₹ ${balance.toFixed(2)}`
    updateResetBtn()
}

incomeBtn.addEventListener('click', () => {
    incomeBtn.classList.add('active')
    expenseBtn.classList.remove('active')
    transactionType = 'income'
})

expenseBtn.addEventListener('click', () => {
    expenseBtn.classList.add('active')
    incomeBtn.classList.remove('active')
    transactionType = 'expense'
})

addBtn.addEventListener('click', () => {
    const dateValue = dateInput.value
    let amountValue = parseFloat(amountInput.value)
    const categoryValue = categoryInput.value

    let addData = 
        ` 
        <tr class='${transactionType}'>
            <td>${dateValue}</td>
            <td>${categoryValue}</td>
            <td>₹ ${amountValue}</td>
        </tr>
        `
    if (!dateValue || !categoryValue || isNaN(amountValue) || amountValue <= 0) {
        alert('Please enter valid data')
        return
    }

    allExpenses.push({
        date: dateValue,
        category: categoryValue,
        amount: amountValue,
        type: transactionType
    })

    localStorage.setItem('allOldExpenses', JSON.stringify(allExpenses))

    expenseTableBody.innerHTML += addData

    balance = transactionType === 'income' ? balance + amountValue : balance - amountValue
    balanceDisplay.textContent = `Balance: ₹ ${balance.toFixed(2)}`

    dateInput.value = ''
    amountInput.value = ''
    categoryInput.value = ''

    updateResetBtn()
})

resetBtn.addEventListener('click', () => {
    balance = 0
    balanceDisplay.textContent = `Balance: ₹ ${balance.toFixed(2)}`
    allExpenses = []
    expenseTableBody.innerHTML = `
                    <thead>
                        <tr>
                            <th> Date </th>
                            <th> Category </th>
                            <th> Amount </th>
                        </tr>
                    </thead>`
    localStorage.removeItem('allOldExpenses')
    updateResetBtn()    
})

function updateResetBtn() {
    if (allExpenses.length === 0) {
        resetBtn.classList.add('inactive')
        resetBtn.disabled = true
    } else {
        resetBtn.classList.remove('inactive')
        resetBtn.disabled = false
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(reg => console.log('SW registered', reg))
    .catch(err => console.error('SW registration failed', err))
}

