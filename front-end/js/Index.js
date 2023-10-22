
document.getElementById('btnLogin').addEventListener('click', async () => {
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await loginAction(name,password);
    
});

async function loginAction(username,password) {
    const setting = {
        method: 'POST',
    };
    const response = await fetch('http://localhost:3000/login/'+ username  + "/" + password, setting);
    if (response.ok) {
        const authenticatedUser = await response.json();
        let currentUser = authenticatedUser;
        //export let sharedObject = currentUser;
        //console.log('login ', currentUser.activeAccounts);
        // alert(currentUser.activeAccounts);
        console.log(currentUser.activeAccounts[0].accountNumber);
        let currentAcc = await fetch('http://localhost:3000/findaccount/' + currentUser.activeAccounts[0].accountNumber, { method: 'GET'});
        if (currentAcc.ok) {
        currentAcc = await currentAcc.json();
        console.log(currentAcc);
        }
    }
    else {
        alert('Authentication failed, ' + response.status);
    }
    document.getElementById('landingpage').click();
}

