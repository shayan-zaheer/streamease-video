const hero = document.querySelector('.hero');
const box = document.querySelector('.box');
const loginlink = document.querySelector('.login-link');
const registerlink = document.querySelector('.register-link');
const loginbtn = document.querySelector('.btn-red-sm');
const closeIcon = document.querySelector('.icon-close');
const forgetPasswordLink = document.getElementById('forgetPasswordLink');
const forgotPasswordForm = document.querySelector('.form-box.forgot-password');
const loginForm = document.querySelector('.form-box.login');
const registerForm = document.querySelector('.form-box.register');
const rememberedLoginLink = document.querySelector('.forgot-password .login-link');
const otpLink = document.querySelector('.forgot-password .continue-link'); // Changed selector
const otpForm = document.querySelector('.form-box.otp-form');
const continueLink = document.querySelector('.otp-form .login-link'); // Changed selector

registerlink.addEventListener('click', () => {
    hero.classList.add('active');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    forgotPasswordForm.style.display = 'none';
    otpForm.style.display = 'none'; // Ensure OTP form is hidden
});

loginlink.addEventListener('click', () => {
    hero.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    otpForm.style.display = 'none'; // Ensure OTP form is hidden
});

loginbtn.addEventListener('click', () => {
    box.classList.add('active-popup');
});

closeIcon.addEventListener('click', () => {
    box.classList.remove('active-popup');
});

forgetPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    forgotPasswordForm.style.display = 'block';
    otpForm.style.display = 'none'; // Ensure OTP form is hidden
});

rememberedLoginLink.addEventListener('click', (event) => { 
    event.preventDefault();
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    otpForm.style.display = 'none'; // Ensure OTP form is hidden
});

otpLink.addEventListener('click', (event) => {
    event.preventDefault();
    forgotPasswordForm.style.display = 'none';
    otpForm.style.display = 'block';
});

continueLink.addEventListener('click', (event) => {
    event.preventDefault();
    otpForm.style.display = 'none';
    loginForm.style.display = 'block';
});

document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "https://i0.wp.com/interplanetary.tv/wp-content/uploads/2024/02/Alienoid-1-landscape-poster-1.jpg?ssl=1",
        "https://s0.smartresize.com/wallpaper/156/622/HD-wallpaper-avengers-endgame-all-characters-superheroes-movies.jpg",
        "https://assets-in.bmscdn.com/discovery-catalog/events/et00040397-psbktzcwam-landscape.jpg",
    ];
    
    const imageElement = document.querySelector(".main");
    let currentIndex = 0;

    function changeImage() {
        imageElement.style.backgroundImage = `url(${images[currentIndex]})`;
        currentIndex = (currentIndex + 1) % images.length;
    }

    setInterval(changeImage, 2500);
});
