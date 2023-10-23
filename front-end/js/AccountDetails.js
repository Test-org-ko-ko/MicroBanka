window.onload =  () => {
     let userAccount = checkAccountDetails();
}

async function checkAccountDetails(){
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
    return fromUserAccount;
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
const transferModal = new bootstrap.Modal(document.getElementById('updateModal'));
// Add an event listener for the "show.bs.modal" event
transferModal._element.addEventListener('show.bs.modal', function(event) {
    document.getElementById('email').value;
    document.getElementById('phone').value;
    document.getElementById('inputAddress').value;
    document.getElementById('inputCity').value;
    document.getElementById('inputPostalCode').value;
    document.getElementById('inputState').value;
});
document.getElementById('btnTransferSave').addEventListener('click', () => {
    console.log('transfer starts..');
    
    const receipient = document.getElementById('receipient').value;
    const amount = parseFloat(document.getElementById('transferamount').value);
    transferAction(receipient, amount);
    console.log('transfer ends..');
});

async function transferAction(receipient, amount) {
    console.log('transfer Action starts..');
    let fromUserAccount;
    const responseFromAcc = await fetch('http://localhost:3000/currentaccount', { method: 'GET'});
    if (responseFromAcc.ok) {
        fromUserAccount = await responseFromAcc.json();
        console.log(fromUserAccount);
    }
    else {
        console.log('current account retrieval failed.');
    }
    const obj = { 
        fromAcctNumber: fromUserAccount.accountNumber,
        toAcctNumber: receipient, 
        amount: amount
    };
    console.log(obj);
    const setting = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Content-Type': 'application/json' }
    };

    const response = await fetch('http://localhost:3000/transfer', setting);
    if (response.ok) {
        const successMsg = await response.json();
        console.log(successMsg);
        alert(successMsg);
    }
    else {
        alert('Transfer failed, ' + response.status);
    }
    console.log('transfer ends..');
    document.getElementById('transferclose').click();
}
// document.getElementById('btnDownloadPDF').addEventListener('click', () => {
//     // Initialize jsPDF
//     const doc = new jsPDF();
//     // Extract table data and headers
//     const table = document.getElementById('myTable');
//     const headers = [];
//     const data = [];

//     // Get headers
//     for (let i = 0; i < table.rows[0].cells.length; i++) {
//         headers[i] = table.rows[0].cells[i].textContent;
//     }

//     // Get table data
//     for (let i = 1; i < table.rows.length; i++) {
//         const row = table.rows[i];
//         const rowData = [];
//         for (let j = 0; j < row.cells.length; j++) {
//             rowData[j] = row.cells[j].textContent;
//         }
//         data.push(rowData);
//     }

//     // Add data to the PDF
//     doc.autoTable({
//         head: [headers],
//         body: data,
//     });

//     // Save the PDF
//     doc.save('account_details.pdf');
// });
