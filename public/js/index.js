$.fn.editable.defaults.mode = 'inline';


let editBtn = document.querySelector('editBtn');

editBtn.addEventListener("click", getParent)

function getParent(event) {
    console.log(event.target.value)
}