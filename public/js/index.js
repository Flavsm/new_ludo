// $.fn.editable.defaults.mode = 'inline';


let choiceSelector = document.querySelector('#type');
let type = document.querySelector('#form-type');
let player = document.querySelector('#form-player');
let team = document.querySelector('#form-team');
let league = document.querySelector('#form-league');

choiceSelector.addEventListener('change', changeForm);

function changeForm(e) {
    if (e.target.value == 'Player') {
        player.style.display = 'block'
        team.style.display = 'none'
        league.style.display = 'none'
        type.style.opacity = '0.5'
    } else if (e.target.value == 'Team') {
        player.style.display = 'none'
        team.style.display = 'block'
        league.style.display = 'none'
        type.style.opacity = '0.5'
    } else if (e.target.value == 'Select') {
        player.style.display = 'none'
        team.style.display = 'none'
        league.style.display = 'none'
        type.style.opacity = '1'
    } else {
        player.style.display = 'none'
        team.style.display = 'none'
        league.style.display = 'block'
        type.style.opacity = '0.5'
    }
}