window.onload =  () => {
    checkAccountDetails();
}
let fromUserAccount;
async function checkAccountDetails(){
    let setting = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    }
    const responseFromAcc =  await fetch('http://localhost:3000/currentuser', setting);
    if (responseFromAcc.ok) {
        fromUserAccount = await responseFromAcc.json();
        console.log(fromUserAccount);
        document.getElementById('accountnumber').value = fromUserAccount.account.accountNumber;
        document.getElementById('balance').value = fromUserAccount.account.balance;
        document.getElementById('type').value = fromUserAccount.account.accountType;
        displayAccountQRCode(fromUserAccount.account.accountNumber);
    }
    else {
        console.log('current account retrieval failed.');
    }

    for(let e of fromUserAccount.account.transactions){
        addRowToTable(e.id,e.date,e.from,e.to,e.type,e.amount);
    }
}

function addRowToTable(id) {
    let row = document.createElement('tr');
    row.setAttribute("id", id);
    for (let e of arguments) {
        let cell = document.createElement('td');
        console.log(e);
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
        let updatedUser = await response.json();
        document.getElementById('close').click();
    }
}
async function withdrawMoney(amount){
    const response =  await fetch('http://localhost:3000/withdraw/' + amount, 
    {
        method:'POST', 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if(response.ok){
        checkAccountDetails();
        let msg = await response.json();
    }
    document.getElementById('remoteclose').click();
}
document.getElementById('btnWithdrawSave').addEventListener("click",() =>{
    const amount = document.getElementById("amount").value;
    withdrawMoney(amount);
});
const transferModal = new bootstrap.Modal(document.getElementById('updateModal'));
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
        alert('Deleted User Account!')
    }
    else{
        alert('User id not existed!');
    }
    window.location.href = 'home.html';
}
document.getElementById('btnTransferSave').addEventListener('click', () => {
    const receipient = document.getElementById('receipient').value;
    const amount = parseFloat(document.getElementById('transferamount').value);
    transferAction(receipient, amount);
});

async function transferAction(receipient, amount) {
    let fromUserAccount;
    const responseFromAcc = await fetch('http://localhost:3000/currentaccount', 
    { 
        method: 'GET', 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if (responseFromAcc.ok) {
        fromUserAccount = await responseFromAcc.json();
    }
    else {
        console.log('current account retrieval failed.');
    }
    const obj = { 
        fromAcctNumber: fromUserAccount.accountNumber,
        toAcctNumber: receipient, 
        amount: amount
    };
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
        const successMsg = await response.json();
        checkAccountDetails();
        console.log(successMsg);
    }
    else {
        alert('Transfer failed, ' + response.status);
    }
    document.getElementById('transferclose').click();
}

function displayAccountQRCode(accountNumber) {
    new QRCode(document.getElementById("qrDiv"), {
        text: accountNumber,
        width: 128,
        height: 128,
        colorDark : "#5868bf",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}
