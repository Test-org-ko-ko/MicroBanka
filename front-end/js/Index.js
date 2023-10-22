
document.getElementById('btnLogin').addEventListener('click', () => {
    const name = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(name,password);
    loginAction(name,password);
    document.getElementById('landingpage').click();
});
async function loginAction(username,password) {
    console.log('login starts..');
    const setting = {
        method: 'POST',
    };

    const response = await fetch('http://localhost:3000/login/'+ username  + "/" + password, setting);
    if (response.ok) {
        const authenticatedUser = await response.json();
        console.log('login ', authenticatedUser);
        alert(authenticatedUser);
    }
    else {
        alert('Authentication failed, ' + response.status);
    }

    console.log('authentication ends..');
    //document.getElementById('backToHomePage').click();
}