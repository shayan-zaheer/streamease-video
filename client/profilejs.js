document.getElementById('updateButton').addEventListener('click', function() {
    alert('Account updated successfully!');
});

document.getElementById('cancelButton').addEventListener('click', function() {
    alert('Cancelled!');
});

document.getElementById('updatePasswordButton').addEventListener('click', function() {
    alert('Password updated successfully!');
});

document.getElementById('cancelPasswordButton').addEventListener('click', function() {
    alert('Cancelled!');
});


document.getElementById('accountLink').addEventListener('click', function() {
    document.getElementById('accountSettings').style.display = 'block';
    document.getElementById('passwordSettings').style.display = 'none';
});

document.getElementById('passwordLink').addEventListener('click', function() {
    document.getElementById('accountSettings').style.display = 'none';
    document.getElementById('passwordSettings').style.display = 'block';
});

const links = document.querySelectorAll('.sidebar ul li a');

links.forEach(link => {
    link.addEventListener('click', (event) => {

        event.preventDefault();

        links.forEach(item => item.parentElement.classList.remove('active'));

        link.parentElement.classList.add('active');
    });
});
