"use strict";

const errorMesgEl = document.querySelector(".error_message");
const budgetInputEl = document.querySelector(".budget_input");
const expenseDesEl = document.querySelector(".expenses_input");
const expenseAmountEl = document.querySelector(".expenses_amount");
const tblRecordEl = document.querySelector(".tbl_data");
const cardContainer = document.querySelector(".cards");

//cards content
const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

let itemList = [];
let itemId = 0;

//============================Button Events======================
function btnEvents(e) {
    const btnBudgetCal = document.querySelector("#btn_budget");
    const btnExpensesCal = document.querySelector("#btn_expenses");

    //=========== Budget Event ==============
    btnBudgetCal.addEventListener("click", (e) => {
        e.preventDefault();
        budgetFun();
    });

    //=========== Expenses Event ==============
    btnExpensesCal.addEventListener("click", (e) => {
        e.preventDefault();
        expensesFun();
    });
}

//==============Calling Btns Event=============
document.addEventListener("DOMContentLoaded", btnEvents);

//===============Expenses Function====================
function expensesFun(){
    let expensesDescValue = expenseDesEl.value;
    let expensesAmountValue = expenseAmountEl.value;
    
    if(expensesDescValue == "" ||
       expensesAmountValue == "" ||
       budgetInputEl < 0
    ) {
        errorMessage("Please Enter Expenses Desc or Expense Amount!");
    } else {
        let amount = parseInt(expensesAmountValue);
        expenseAmountEl.value = "";
        expenseDesEl.value = "";

        // store the value inside the object
        let expenses = {
            id: itemId,
            title: expensesDescValue,
            amount: amount,
        };
        itemId++;
        itemList.push(expenses);
        
        // add expenses inside the html page
        addExpenses(expenses);
        showBalance();
    }
}

//--add Expenses--
function addExpenses(expensesPara) {
    const html = `
        <ul class="tbl_tr_content" data-id="${expensesPara.id}">
            <li>${expensesPara.id}</li>
            <li>${expensesPara.title}</li>
            <li><span>$</span>${expensesPara.amount}</li> 
            <li>
                <button type="button" class="btn_edit">Edit</button>
                <button type="button" class="btn_delete">Delete</button>
            </li>
        </ul>
    `;
    tblRecordEl.insertAdjacentHTML("beforeend", html);
}

tblRecordEl.addEventListener("click", function (e) {
    const target = e.target;
    const row = target.closest(".tbl_tr_content");
    const id = parseInt(row.dataset.id);

    if (target.classList.contains("btn_delete")) {
        // Delete row
        row.remove();
        itemList = itemList.filter(item => item.id !== id);
        showBalance();
    }

    if (target.classList.contains("btn_edit")) {
        // Edit row
        const expense = itemList.find(item => item.id === id);
        if (expense) {
            expenseDesEl.value = expense.title;
            expenseAmountEl.value = expense.amount;
        }

        // Remove the item so it can be updated
        itemList = itemList.filter(item => item.id !== id);
        row.remove();
        showBalance();
    }
 });

//=============Budget Function================
function budgetFun() {
    const budgetValue = budgetInputEl.value;

    if (budgetValue == "" || budgetValue < 0) {
        errorMessage("Please Enter Your Budget or More Than 0")
    } else {
        budgetCardEl.textContent = budgetValue;
        budgetInputEl.value = "";
        showBalance();
    }
}

//==================Show Balance============
function showBalance(){
    const expenses = totalExpenses();
    const balance = parseInt(budgetCardEl.textContent) - expenses;

    balanceCardEl.textContent = balance;
}


//=================Total Expenses==========
function totalExpenses(){
    let total = 0;
    
    if(itemList.length > 0){
        total = itemList.reduce(function (acc, curr){
            acc += curr.amount;
            return acc;
        }, 0);
    }
    expensesCardEl.textContent = total;
    
    return total;
}

// --error function--

function errorMessage(message) {
    errorMesgEl.innerHTML = `<p>${message}</p>`;

    errorMesgEl.classList.add("error");

    setTimeout(() => {
        errorMesgEl.classList.remove("error");
    }, 2500);
}


