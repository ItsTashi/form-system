import PocketBase from "../pocketbase-js-sdk/pocketbase.es.mjs";

/* for production */
const host = new PocketBase('https://petite-match.pockethost.io');

/* for development
const host = new PocketBase('http://127.0.0.1:8090')
*/

const authStore = host.authStore
const userModel = host.authStore.model

// check if the user is logged in then hide registering or login elements
if (authStore.isValid){
    document.getElementById('login').style.display = 'none';
    document.getElementById('registration').style.display = 'none'
    document.getElementById('loggedIn').style.display = 'flex'
    document.getElementById('userLoggedIn').innerHTML = `Hello, ${userModel.name}`
}

// User sign-in
document.querySelector('button[name="login"]').addEventListener("click", (event) => {
    event.preventDefault()
    
    const userLoginCredentials = {
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value
    }

    authentication(userLoginCredentials.username, userLoginCredentials.password)
})

document.querySelector('button[name="logout"').addEventListener("click", (event) => {
    event.preventDefault()

    authStore.clear()
    location.reload()
})

// User Registration

document.querySelector('button[name="register"]').addEventListener("click", (event) => {
    event.preventDefault()
    
    const userRegistrationCredentials = {
        "username": document.getElementById('register_username').value.trim(),
        "email": document.getElementById('register_email').value.trim(),
        "password": document.getElementById('register_password').value,
        "passwordConfirm": document.getElementById('passwordConfirm').value,
        "name":  document.getElementById('fullName').value.trim(),
    }

    registration(userRegistrationCredentials)
})

document.querySelector('button[name="submit"]').addEventListener("click", (event) => {
    event.preventDefault()

    createForm()
})

// Modules 

async function authentication(username, password){
    await host.collection('users').authWithPassword(username, password)

    authStore.isValid ? console.log('successful login') : console.log('please try to login again')
    location.reload()
}

async function registration(registrationCredentials){
    await host.collection('users').create(registrationCredentials)
    location.reload();
}

async function createForm(){
    let form = document.getElementById('formPost').value

    if (!(form === "")) {console.log(form)}
    
    let data = {
        "user": userModel.id,
        "form_reply": form,
    }

    await host.collection('forms').create(data)
}

// Verification and validation

if (authStore.isValid) {
    console.log(userModel.name.trim() + ' is logged in')
}

const forms = await host.collection('forms').getFullList(1, 50, {
})

forms.forEach(form => {
    console.table(form)
})