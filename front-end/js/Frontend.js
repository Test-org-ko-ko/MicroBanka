window.onload = () => {
}

async function submitAction(userData) {
    console.log('registeration starts..');
    if (!userData) {
        alert('Provide Data.');
        return;
    }

    let errors = [];
    for (let key of Object.keys(userData)) {
        if (!userData[key]) {
            errors.push(key);
        }
    } 

    if (errors.length > 0) {
        alert('Provide missing fields: ' + errors.join(', '));
        return;
    }

    const setting = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer register' 
        }
    };

    const response = await fetch('http://localhost:3000/account', setting);
    if (response.ok) {
        const { message } = await response.json();
        alert(message);
    }
    else {
        alert('Registration failed, ' + response.status);
    }
    console.log('registeration ends..');
    document.getElementById('backToHomePage').click();
}

document.getElementById('btnRegister').addEventListener('click', () => {
    const addressData = document.getElementsByName('address');
    let address = [];
    addressData.forEach(data => { 
        console.log(data);
        address.push(data.value);
    });
    address = address.join(', ');

    const obj = {
        name : document.getElementById('name').value,
        email : document.getElementById('email').value,
        password : document.getElementById('password').value,
        address: address,
        phone : document.getElementById('phone').value,
        ssn : document.getElementById('ssn').value,
        securityAns : document.getElementById('securityAns').value,
        securityQtn : document.getElementById('securityQtn').value,
        initialDeposit : document.getElementById('initialDeposit').value,
        accountType : document.getElementById('accountType').value
    }

    if (!validateIfEmpty(obj)) {
        alert('All fields are required to register your account.');
        return;
    }
    submitAction(obj);
});

function validateIfEmpty(obj) {
    if (obj) {
        for (let data of Object.values(obj))
            if (!data) return false;
    }
    return true;
}
