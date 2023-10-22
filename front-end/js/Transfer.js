window.onload = () => {
    
}
document.getElementById('btnTransfer').addEventListener('click', () => {
    console.log('transfer starts..');
    
    const receipient = document.getElementById('receipient').value;
    const amount = parseFloat(document.getElementById('amount').value);
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
    document.getElementById('landingpage').click();
}
