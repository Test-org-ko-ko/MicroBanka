window.onload =  () => {
     checkAccountDetails();
}

async function checkAccountDetails(){
    console.log('abc');
    let fromUserAccount;
    const responseFromAcc =  await fetch('http://localhost:3000/currentaccount', { method: 'GET'});
    console.log(responseFromAcc);
    if (responseFromAcc.ok) {
        fromUserAccount = await responseFromAcc.json();
        console.log(fromUserAccount);
    }
    else {
        console.log('current account retrieval failed.');
    }
    document.getElementById('accountnumber').value=fromUserAccount.accountNumber;
    document.getElementById('balance').value=fromUserAccount.balance;
    document.getElementById('type').value=fromUserAccount.accountType;

    for(let e of fromUserAccount.transactions){
        addRowToTable(e.id, e.date, e.from, e.to, e.type, e.amount);
    }
}

function addRowToTable(id, date, from, to, type, balance) {
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
        headers: { 'Content-Type': 'application/json' }
    };
    const response =  await fetch('http://localhost:3000/updateprofile', setting);
    if(response.ok){
        let updatedUser = await response.json();
        document.getElementById('close').click();
        alert('Closed');
    }
}
async function withdrawMoney(amount){
    const response =  await fetch('http://localhost:3000/withdraw/' + amount, {method:'POST'});
    if(response.ok){
        let msg = await response.json();
        alert(msg.message);
    }
}
document.getElementById('btnWithdrawSave').addEventListener("click",() =>{
    const amount = document.getElementById("amount").value;
    withdrawMoney(amount);
});