window.onload = () => {
}

document.getElementById('changePasswordBtn').addEventListener('click', () => {
    const password = document.getElementById('pw1').value;
    const passwordConfirmed = document.getElementById('pw2').value;
    if (password || 
        passwordConfirmed ||
        password !== passwordConfirmed) {
            alert('Please confirm your passwords');
            return;
    }

    const obj = {
        username: document.getElementById('username').value,
        securityAns: document.getElementById('securityAns').value,
        securityQtn: document.getElementById('securityQtn').value,
        password: password
    }

    if (!validateIfEmpty(obj)) {
        alert('All fields are required to change password.');
        return;
    }
    changePassword(obj);
});

const key = '9403-a874137fe85a';
async function changePassword(obj) {
    const setting = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: { 'Authorization': 'Bearer changepassword' }
    };
    const response = await fetch('http://localhost:3000/changepassword', setting);
    if (response.ok) {
        const { message } = await response.json();
        alert(message);
        document.getElementById('backToHomePage').click();
    }
    else {
        alert('Password change failed, ' + response.status);
    }
}

function validateIfEmpty(obj) {
    if (obj) {
        for (let data of Object.values(obj))
            if (!data) return false;
    }
    return true;
}