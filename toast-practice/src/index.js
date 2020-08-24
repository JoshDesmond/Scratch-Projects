import Toastify from 'toastify-js';


Toastify({
    text: "This is a toast",
    duration: 3000,
    destination: "google.com",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: 'left', // `left`, `center` or `right`
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    onClick: function(){} // Callback after click
}).showToast();

document.getElementById('toast-button').addEventListener('click', (ev => {
    Toastify({
        text: "This is a toast",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: 'right', // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: function(){} // Callback after click
    }).showToast();
}));