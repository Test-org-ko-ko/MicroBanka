window.onload =  () => {
    checkAccountDetails();
}

async function checkAccountDetails(){
    let fromUserAccount;
    let setting = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    }
    const responseFromAcc =  await fetch('http://localhost:3000/currentaccount', setting);
    console.log(responseFromAcc);
    if (responseFromAcc.ok) {
        fromUserAccount = await responseFromAcc.json();
        console.log(fromUserAccount);
        document.getElementById('accountnumber').value = fromUserAccount.accountNumber;
        document.getElementById('balance').value = fromUserAccount.balance;
        document.getElementById('type').value = fromUserAccount.accountType;
        displayAccountQRCode(fromUserAccount.accountNumber);
    }
    else {
        console.log('current account retrieval failed.');
    }

    for(let e of fromUserAccount.transactions){
        addRowToTable(e.id, e.date, e.from, e.to, e.type, e.amount);
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
            console.log(data);
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
        alert('Closed');
    }
}
async function withdrawMoney(amount){
    const response =  await fetch('http://localhost:3000/withdraw/' + amount, 
    {
        method:'POST', 
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if(response.ok){
        let msg = await response.json();
        alert(msg.message);
    }
}
document.getElementById('btnWithdrawSave').addEventListener("click",() =>{
    const amount = document.getElementById("amount").value;
    withdrawMoney(amount);
});

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
