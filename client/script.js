const hero=document.querySelector('.hero');
const box=document.querySelector('.box');
const loginlink=document.querySelector('.login-link');
const registerlink=document.querySelector('.register-link');
const loginbtn=document.querySelector('.btn-red-sm');
const closeIcon=document.querySelector('.icon-close');


registerlink.addEventListener('click',()=>{
    hero.classList.add('active');
})

loginlink.addEventListener('click',()=>{
    hero.classList.remove('active');
})

loginbtn.addEventListener('click',()=>{
    box.classList.add('active-popup');
})

closeIcon.addEventListener('click',()=>{
    box.classList.remove('active-popup');
})

document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "https://i0.wp.com/interplanetary.tv/wp-content/uploads/2024/02/Alienoid-1-landscape-poster-1.jpg?ssl=1",
        "https://s0.smartresize.com/wallpaper/156/622/HD-wallpaper-avengers-endgame-all-characters-superheroes-movies.jpg",
        "https://assets-in.bmscdn.com/discovery-catalog/events/et00040397-psbktzcwam-landscape.jpg",
        // "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2022/06/aditya-1-1654353920.jpg"
    ]; // Array of image paths
    
    const imageElement = document.querySelector(".main");
    let currentIndex = 0;

    function changeImage() {
        imageElement.style.backgroundImage = `url(${images[currentIndex]})`;
        currentIndex = (currentIndex + 1) % images.length;
    }

    setInterval(changeImage, 2500);
});


// document.addEventListener()