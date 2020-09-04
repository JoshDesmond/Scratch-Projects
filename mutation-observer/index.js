function addContentToPage() {
    const p = document.createElement('p');
    p.innerText = "This text was just added";
    document.body.appendChild(p);
}

// function mutationCallback;