
window.onload = () => {
};

document.getElementById('btnLogin').addEventListener('click', async () => {
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!validateIfEmpty(name, password)) {
        alert('All fields are required to log in.');
        return;
    }
    loginAction(name,password);
});
document.getElementById('btnSignup').addEventListener('click', () => {
    window.location.href = 'register.html';
});

document.getElementById('btnChangePassword').addEventListener('click', () => {
    window.location.href = 'changepassword.html';
});

async function loginAction(username, password) {
    const setting = {
        method: 'POST',
        headers: { 'Authorization': 'Bearer login' }
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
        alert('Authentication failed, ' + response.status);
        const { message } = await response.json();
        if ('Token missing' === message) {
            alert(message, response.status);
            console.log(message, response.status);
        }
    }
}

function saveTokenInLocalStorage(token) {
    localStorage.setItem("token", token);
    console.log(localStorage.getItem('token'));
}

function validateIfEmpty() {
    if (arguments) {
        for (let data of arguments)
            if (!data) return false;
    }
    return true;
}