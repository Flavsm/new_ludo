// $.fn.editable.defaults.mode = 'inline';

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