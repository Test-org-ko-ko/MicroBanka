window.onload = () => {
};

document.getElementById('btnLogin').addEventListener('click', async () => {
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginAction(name,password);
});
document.getElementById('btnSignup').addEventListener('click', () => {
    window.location.href = 'register.html';
});
document.getElementById('changepassword').addEventListener('click', () => {
    window.location.href = 'changepassword.html';
});

async function loginAction(username, password) {
    const setting = {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' }
    };
    const response = await fetch('http://localhost:3000/login/'+ username  + "/" + password, setting);
    if (response.ok) {
        const res = await response.json();
        if (res) {
            const { accountNumber, token } = res;
            saveTokenInLocalStorage(token);

            let currentAcc = await fetch('http://localhost:3000/findaccount/' + accountNumber, 
            { 
                method: 'GET', 
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            if (currentAcc.ok) {
                currentAcc = await currentAcc.json();
                console.log(currentAcc);
                document.getElementById('landingpage').click();
            }
        }
    }
    else {
        const { message } = await response.json();
        alert(message, ', Status', response.status);
    }
}

function saveTokenInLocalStorage(token) {
    localStorage.setItem("token", token);
    console.log(localStorage.getItem('token'));
}

