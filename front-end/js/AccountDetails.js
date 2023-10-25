
window.onload =  () => {
    checkAccountDetails();
}

const LOWER_LIMIT = 100;

let fromUserAccount;
async function checkAccountDetails(){
    console.log('token retrieved from local storage:', localStorage.getItem('token'));
    let setting = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    }
    const responseFromAcc =  await fetch('http://localhost:3000/currentuser', setting);
    console.log(responseFromAcc);
    if (responseFromAcc.ok) {
        fromUserAccount = await responseFromAcc.json();
        console.log(fromUserAccount);
        document.getElementById('username').value = fromUserAccount.name;
        document.getElementById('accountnumber').value = fromUserAccount.account.accountNumber;
        document.getElementById('balance').value = fromUserAccount.account.balance;
        document.getElementById('type').value = fromUserAccount.account.accountType;
        displayAccountQRCode(fromUserAccount.account.accountNumber);

    }
    else {
        console.log('current account retrieval failed.');
    }

    document.getElementById('tbodyTransactionsList').innerHTML = '';
    for(let e of fromUserAccount.account.transactions){
        const from = (e.from) ? e.from : 'N/A';
        const to = (e.to) ? e.to : 'N/A';
        addRowToTable(e.id, e.date, from, to, e.type, e.amount);
    }
}

function addRowToTable(id) {
    let row = document.createElement('tr');
    row.setAttribute("id", id);
    for (let e of arguments) {
        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(e));
        row.appendChild(cell);
    }
    document.getElementById('tbodyTransactionsList').appendChild(row);
}

document.getElementById('btnSave').addEventListener("click", () =>{
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const addressData = document.getElementsByName('address');
    let address = [];
    addressData.forEach(data => { 
        address.push(data.value);
    });
    address = address.join(', ');
    let obj ={
        email,
        phone,
        address
    };

    if (!validateIfEmpty(obj)) {
        alert('All fields are required to update profile.');
        return;
    }
    updateProfileDetails(obj);
});

async function updateProfileDetails(updateData){
    const setting = {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + localStorage.getItem('token') 
        }
    };
    const response =  await fetch('http://localhost:3000/updateprofile', setting);
    if(response.ok){
        checkAccountDetails();
        let { message } = await response.json();
        alert(message);
        document.getElementById('close').click();
    }
}
async function withdrawMoney(amount){
    const response =  await fetch('http://localhost:3000/withdraw/' + amount, 
    {
        method:'POST', 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if (response.ok) {
        checkAccountDetails();
        let msg = await response.json();
        alert(msg.message);
    }
    else {
        let msg = await response.json();
        alert(msg.message);
    }
    document.getElementById('remoteclose').click();
}
document.getElementById('btnWithdrawSave').addEventListener("click",() =>{
    let amount = document.getElementById("amount").value;
    if (!validateIfEmpty({ amount })) {
        alert('All fields are required to withdraw money.');
        return;
    }

    if (LOWER_LIMIT > fromUserAccount.account.balance - amount) {
        const isConfirmed = confirm('Overdraft Warning: You will be charged 5 USD if you wish to continue this transaction.');
        if (isConfirmed)
            amount = Number(amount) + 5;
        else 
            return;
    }
    withdrawMoney(amount);
});
const transferModal = new bootstrap.Modal(document.getElementById('updateModal'));
// Add an event listener for the "show.bs.modal" event
transferModal._element.addEventListener('show.bs.modal', function(event) {
    document.getElementById('email').value = fromUserAccount.email;
    document.getElementById('phone').value = fromUserAccount.phone;
    let address = fromUserAccount.address.split(",");
    address.forEach((value, index) => {
        const inputElement = document.getElementById('addr' + (index + 1));
        if (inputElement) {
            inputElement.value = value;
        }
    });
});

document.getElementById('btnTransferSave').addEventListener('click', () => {
    console.log('transfer starts..');
    
    const receipient = document.getElementById('receipient').value;
    let amount = parseFloat(document.getElementById('transferamount').value);
    let amountToDebit = amount;
    if (!validateIfEmpty({ receipient, amount })) {
        alert('All fields are required to make a transfer.');
        return;
    }
    if (LOWER_LIMIT > fromUserAccount.account.balance - amount) {
        const isConfirmed = confirm('Overdraft Warning: You will be charged 5 USD if you wish to continue this transaction.');
        if (isConfirmed)
            amount += 5;
        else 
            return;
    }
    transferAction(receipient, amount, amountToDebit);
    console.log('transfer ends..');
});

async function transferAction(receipient, amount, amountToDebit) {
    // let fromUserAccount;
    // const responseFromAcc = await fetch('http://localhost:3000/currentaccount', 
    // { 
    //     method: 'GET', 
    //     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    // });
    // if (responseFromAcc.ok) {
    //     fromUserAccount = await responseFromAcc.json();
    //     console.log(fromUserAccount);
    // }
    // else {
    //     console.log('current account retrieval failed.');
    // }
    const obj = { 
        fromAcctNumber: fromUserAccount.account.accountNumber,
        toAcctNumber: receipient, 
        amount: amount,
        amountToDebit
    };
    console.log(obj);
    const setting = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };

    const response = await fetch('http://localhost:3000/transfer', setting);
    if (response.ok) {
        checkAccountDetails();
        const { message } = await response.json();
        alert(message);
    }
    else {
        const { message } = await response.json();
        alert('Transfer failed, ' + response.status + ', ' + message);
    }
    document.getElementById('transferclose').click();
}

function displayAccountQRCode(accountNumber) {
    document.getElementById("qrDiv").innerHTML = '';
    new QRCode(document.getElementById("qrDiv"), {
        text: accountNumber,
        width: 128,
        height: 128,
        colorDark : "#5868bf",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    document.getElementById('backToHome').click();
});

function validateIfEmpty(obj) {
    if (obj) {
        for (let data of Object.values(obj))
            if (!data) return false;
    }
    return true;
}

document.getElementById('btnDeleteSave').addEventListener('click',()=>{
    deleteAcct(fromUserAccount.id);
});

async function deleteAcct(id){
    const response = await fetch('http://localhost:3000/delete/'+ id,
    {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if(response.ok){
        let deleted = await response.json();
        localStorage.removeItem('token');
        alert('Deleted User Account!');
    }
    else{
        alert('User id not existed!');
    }
    window.location.href = 'home.html';
}
