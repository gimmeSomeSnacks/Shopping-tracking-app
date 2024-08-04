document.getElementById("signUp").addEventListener("click", signUpEvent);

document.getElementById("signIn").addEventListener("click", signInEvent);

function signUpEvent(event) {
    event.preventDefault();
    document.getElementById("signInForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "flex";
}

function signInEvent(event) {
    event.preventDefault();
    document.getElementById("signInForm").style.display = "flex";
    document.getElementById("signUpForm").style.display = "none";
}

function showConfirmation() {
    let passwordInput = document.getElementById('signUpPassword');
    let confirmationInput = document.getElementById('signUpConfirmation');

    if (passwordInput.value) {
        confirmationInput.style.display = 'block';
    } else {
        confirmationInput.style.display = 'none';
    }
}

function clearSignUp() {
    document.getElementById('signUpName').value = '';
    document.getElementById('signUpSirname').value = '';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
    document.getElementById('signUpConfirmation').value = '';
    document.getElementById('signUpConfirmation').style.display='none';
}

function clearSignIn() {
    document.getElementById('signInEmail').value = '';
    document.getElementById('signInPassword').value = '';
}

async function sendSignIn() {
    let username = document.getElementById("signInEmail").value;
    let password = document.getElementById("signInPassword").value;
    let userSignIn = {
        username,
        password
    }
    let response = await fetch("http://localhost:8080/sign-in", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userSignIn)
    });
    if (!response.ok) {
        alert(response.status);
    }
    window.location = `/page-list.html`;
}

async function sendSignUp() {
    let username = document.getElementById("signUpName").value;
    let password = document.getElementById("signUpPassword").value;
    let email = document.getElementById("signUpEmail").value;
    let userSignUp = {
        username,
        password,
        email
    }
    let response = await fetch("http://localhost:8080/sign-up", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userSignUp)
    });
    if (!response.ok) {
        alert(response.status);
    }
    signInEvent(new Event('click'));
}