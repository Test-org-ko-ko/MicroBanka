window.onload = () => {
};

document.getElementById('btnLogin').addEventListener('click', async () => {
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginAction(name,password);
});

const key = '9403-a874137fe85a';
async function loginAction(username,password) {
    const setting = {
        method: 'POST',
        headers: {
            'Authorization' : 'Bearer ' + key
        }
    };
    const response = await fetch('http://localhost:3000/login/'+ username  + "/" + password, setting);
    if (response.ok) {
        const authenticatedUser = await response.json();
        let currentAcc = await fetch('http://localhost:3000/findaccount/' + authenticatedUser.activeAccounts[0].accountNumber, 
            { 
                method: 'GET',         
                headers: { 'Authorization': 'Bearer ' + key }
            }
        );
        if (currentAcc.ok) {
            currentAcc = await currentAcc.json();
            console.log(currentAcc);
            document.getElementById('landingpage').click();
        }
    }
    else {
        alert('Authentication failed, ' + response.status);
    }
    
}

