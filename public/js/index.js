// $.fn.editable.defaults.mode = 'inline';



//conditional for the model modal that has 3 options to add
if (window.location.pathname.includes('home')) {
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
}


// get table headers
const tableHeader = Array.from(document.querySelectorAll('.table-head th')).slice(0, 9).map(el => el.innerText);

//get edit and add modal labels
const teamEditModal = Array.from(document.querySelectorAll('.edit-label'));
const teamAddModal = Array.from(document.querySelectorAll('.add-label'));

//place table headers as label in the modals
teamEditModal.forEach((el, i) => el.innerText = tableHeader[i])
teamAddModal.forEach((el, i) => el.innerText = tableHeader[i])


//array of each sport position
const football = ['C', 'G', 'T', 'TE', 'WR', 'FB', 'RB', 'QB', 'DE', 'DT', 'NG', 'LB', 'CB', 'FS/SS', 'K', 'H', 'LS', 'KR', 'P', 'PR', 'OTHER'].sort()
const basketball = ['PG', 'SF', 'C', 'SG', 'PF'].sort()
const baseball = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'RF', 'CF', 'DH'].sort()
const soccer = ['GK', 'RB', 'LB', 'CB', 'CDM', 'RW', 'LW', 'CF', 'CM', 'F'].sort()
const hockey = ['G', 'RD', 'LD', 'RW', 'LW', 'C'].sort()


//get the select for sport and position
const modalsSport = Array.from(document.querySelectorAll('.home-sport'))
const modalsPosition = document.querySelector('.home-position')

//add change event to sport select
modalsSport.forEach(el => el.addEventListener('change', getSport))

//function on sport change, change the options of position select
function getSport(e) {
    modalsPosition.innerHTML = '<option selected>Select</option>'
    e.target.value == 'Football' ?
        football.forEach(el => {
            let option = document.createElement('option');
            option.innerText = `${el}`
            modalsPosition.appendChild(option)
        }) : e.target.value == 'Basketball' ? basketball.forEach(el => {
            let option = document.createElement('option');
            option.innerText = `${el}`
            modalsPosition.appendChild(option)
        }) : e.target.value == 'Baseball' ? baseball.forEach(el => {
            let option = document.createElement('option');
            option.innerText = `${el}`
            modalsPosition.appendChild(option)
        }) : e.target.value == 'Soccer' ? soccer.forEach(el => {
            let option = document.createElement('option');
            option.innerText = `${el}`
            modalsPosition.appendChild(option)
        }) : hockey.forEach(el => {
            let option = document.createElement('option');
            option.innerText = `${el}`
            modalsPosition.appendChild(option)
        })
}



//////// TABLE /////

// if (window.location.pathname.match(/[\d]/g)) {
//     let rowBtn = document.querySelector('.add-row-btn')

//     rowBtn.addEventListener('click', addRow)

//     function addRow() {
//         let newRow = document.createElement('tr');
//         newRow.innerHTML = '<td>-</td>'.repeat(3)
//         document.querySelector('.table').appendChild(newRow)
//     }

// }



// const table = document.querySelector('.table');

// const cells = Array.from(table.getElementsByTagName('td'));

// cells.forEach(el => {
//     el.addEventListener('click', getCell)
// })

// function getCell() {
//     if (this.hasAttribute('data-clicked')) {
//         return;
//     }
//     this.setAttribute('data-clicked', 'yes')
//     this.setAttribute('data-text', this.innerHTML);

//     const input = document.createElement('input');
//     input.setAttribute('type', 'text');
//     input.value = this.innerHTML;
//     input.style.width = this.offsetWidth - (this.clientLeft * 2) + 'px';
//     input.style.height = this.offsetHeight - (this.clientTop * 2) + 'px';
//     input.style.border = '0px';
//     input.style.fontFamily = 'inherit';
//     input.style.fontSize = 'inherit';
//     input.style.textAlign = 'inherit';
//     input.style.background = 'lightyellow';

//     console.log(this)
//     input.onblur = function () {
//         const td = input.parentElement;
//         const origText = input.parentElement.getAttribute('data-text');
//         const currentText = this.value;
//         if (origText != currentText) {
//             //there are changes in the cell's text
//             //save the new data to db using ajax
//             td.removeAttribute('data-clicked')
//             td.removeAttribute('data-text');
//             td.innerText = currentText;
//             td.style.cssText = 'padding: 5px';
//             console.log(origText + ' changed to ' + currentText)
//         } else {
//             td.removeAttribute('data-clicked')
//             td.removeAttribute('data-text');
//             td.innerHTML = origText;
//             console.log('no changes made')
//         }
//     }

//     input.onkeydown = function (event) {
//         if (event.key == 'Enter') {
//             event.preventDefault()
//             console.log('enter')
//             this.onblur();
//         }
//     }
//     this.innerHTML = '';
//     this.style.cssText = 'padding: 0px';
//     this.append(input);
//     this.firstElementChild.select();
// }
// console.log(cells)