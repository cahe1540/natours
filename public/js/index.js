/*eslint-disable*/
import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import  { bookTour }  from './stripe'

//dom Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form-login');
const logOutBtn = document.querySelector('.nav__el--logout');
const editDataForm = document.querySelector('.form-user-data');
const editPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

//Delegation
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if(loginForm){
    //values
    loginForm.addEventListener('submit', (e) => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        e.preventDefault();
        login(email, password); 
    })
}

if(editDataForm && editPasswordForm){
    editDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });

    editPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const password = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const passwordConfirmed = document.getElementById('password-confirm').value;
        
        await updateSettings({password, newPassword, passwordConfirmed }, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if(bookBtn){
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...'
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    })
}

if(logOutBtn){
    logOutBtn.addEventListener('click', logout);
}