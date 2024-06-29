document.addEventListener("DOMContentLoaded", () => {
    const heartButtons = document.querySelectorAll('.heart-btn');

    heartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const heartIcon = button.querySelector('.bx');
            if (heartIcon.classList.contains('bxs-heart')) {
                heartIcon.classList.remove('bxs-heart');
                heartIcon.classList.add('bx-heart');
                heartIcon.style.color = '';
            } else {
                heartIcon.classList.remove('bx-heart');
                heartIcon.classList.add('bxs-heart');
                heartIcon.style.color = '#ffffff';
            }
        });
    });
});
