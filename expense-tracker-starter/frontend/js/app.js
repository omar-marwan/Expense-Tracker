// Expense Tracker - frontend logic

// PHASE 2
// Backend is already running with real expenses in the database.

// API URL
const API_URL = "http://localhost:3000/api/expenses";
const x = document.getElementById("filterCategory")
let expenses = [];

// =========================
// GET EXPENSES
// =========================
async function getExpenses() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching expenses:", error);
         showAlert("Failed to add expense");
        throw error;
    }
}


// =========================
// ADD EXPENSE
// =========================
async function addExpense(data) {
    showSpinner
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error adding expense:", error);
         showAlert("Failed to add expense");
        throw error;
    }
    finally {
    hideSpinner();
}
}


// =========================
// UPDATE EXPENSE
// =========================
async function updateExpense(id, data) {
    showSpinner
    try {
        const response = await fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error updating expense:", error);
         showAlert("Failed to add expense");
        throw error;
    }
    finally {
    hideSpinner();
}
}


// =========================
// DELETE EXPENSE
// =========================
async function deleteExpense(id) {
    showSpinner
    try {
        const response = await fetch(API_URL + "/" + id, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error deleting expense:", error);
         showAlert("Failed to add expense");
        throw error;
    }
    finally {
    hideSpinner();
}
}


// =========================
// REFRESH
// =========================
async function refresh() {

    showSpinner();

    try {

        const data = await getExpenses();

        expenses = data;

        renderTable(expenses);
        renderSummary(expenses);

    } catch (error) {

        console.error("Refresh error:", error);

    } finally {

        hideSpinner();

    }
}

// =========================
// RENDER TABLE
// =========================
function renderTable(list) {

    const table = document.getElementById("expensesTableBody");

    table.innerHTML = "";

    list.forEach((expense) => {

        const row = document.createElement("tr");


        // Title
        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;


        // Amount
        const amountCell = document.createElement("td");
        amountCell.textContent = expense.amount;


        // Category
        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;


        // Date
       const dateCell = document.createElement("td");
       dateCell.textContent = new Date(expense.date).toLocaleDateString("en-CA");


        // Actions
        const actionsCell = document.createElement("td");


        // Edit button
       const editButton = document.createElement("button");

editButton.textContent = "Edit";
editButton.className = "btn btn-warning btn-sm me-2";

editButton.addEventListener("click", () => {

    // Put expense data inside the modal
    document.getElementById("edit-id").value = expense.id;
    document.getElementById("edit-title").value = expense.title;
    document.getElementById("edit-amount").value = expense.amount;
    document.getElementById("edit-category").value = expense.category;

    // Format date for input type="date"
    document.getElementById("edit-date").value =
        new Date(expense.date).toLocaleDateString("en-CA");

    // Open Bootstrap modal
    const modal = new bootstrap.Modal(
        document.getElementById("edit-modal")
    );

    modal.show();
});



        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.addEventListener("click",async()=>
        {
            try
            {
                await deleteExpense(expense.id);
                await refresh();

            }
            catch(error)
            {
                console.error("Error deleting expense:", error);
            }
        })

        // Add buttons to actions cell
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);


        // Add cells to row
        row.appendChild(titleCell);
        row.appendChild(amountCell);
        row.appendChild(categoryCell);
        row.appendChild(dateCell);
        row.appendChild(actionsCell);


        // Add row to table
        table.appendChild(row);
    });
}

// =========================
// EDIT FORM
// =========================

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const id = document.getElementById("edit-id").value;
    const title = document.getElementById("edit-title").value;
    const amount = document.getElementById("edit-amount").value;
    const category = document.getElementById("edit-category").value;
    const date = document.getElementById("edit-date").value;

    const data = {
        title: title,
        amount: Number(amount),
        category: category,
        date: date
    };

    try {

        await updateExpense(id, data);

        // Close modal
        const modalElement = document.getElementById("edit-modal");
        const modal = bootstrap.Modal.getInstance(modalElement);

        modal.hide();

        // Get updated data from database
        await refresh();

    } catch (error) {

        console.error("Error saving changes:", error);

    }
});
// =========================
// RENDER SUMMARY
// =========================
function renderSummary(list) 
{
    const total = document.getElementById("totalAmount");
    let x = 0;

    for (let i = 0; i < expenses.length; i++) {
    x = x + Number(expenses[i].amount);
}
total.innerText=x;
const count = document.getElementById("expenseCount");

count.innerText = expenses.length;
const highest = document.getElementById("highestExpense");

let max = 0;

for (let i = 0; i < expenses.length; i++) {
    if (Number(expenses[i].amount) > max) {
        max = Number(expenses[i].amount);
    }
}

highest.innerText = max;
}


// =========================
// FILTER
// =========================
function applyFilter() {
    if (x.value === "all") {
        renderTable(expenses);
        return;
    }

    const y = expenses.filter((e) => {
        return e.category === x.value;
    });

    renderTable(y);
}

const form = document.getElementById("expenseForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const data = {
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    try {

        await addExpense(data);

        form.reset();

        await refresh();

    } catch (error) {

        console.error("Error adding expense:", error);

    }
});
const spinner = document.getElementById("spinner");

function showSpinner() {
    spinner.classList.remove("d-none");
}

function hideSpinner() {
    spinner.classList.add("d-none");
}
const alertContainer = document.getElementById("alertContainer");

function showAlert(message) {

    alertContainer.innerHTML = `
        <div class="alert alert-danger d-flex align-items-center" role="alert">
            <span class="me-2">⚠️</span>
            <div>${message}</div>
        </div>
    `;
}
// =========================
// START
// =========================
refresh();
x.addEventListener("change",applyFilter)