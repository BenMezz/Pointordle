import { answers, threewords, fourwords, fivewords, sixwords } from './words.js';
import { wordlist } from './wordlist.js';

let words;
let animating = false;

const beg_date = new Date('05/25/2023');
const current_date = new Date();

const Difference_In_Days = (current_date.getTime() - beg_date.getTime()) / (1000 * 3600 * 24);

let localstorage_num = 0;
while (true) {
  if (!localStorage.hasOwnProperty(localstorage_num + 1)) break;
  localstorage_num++;
}

const container = document.querySelector('.container');
const modal = document.getElementById('modal');

document.addEventListener('keydown', eventfunc);

const answer = wordlist[Math.floor(Difference_In_Days) - 1];

const tp = 500;
const lp = 500;

function i_n(current_active_tile, i) {
	return document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:nth-child(${i + 1})`);
}

if (answer.length == 3) {
	words = threewords;
} else if (answer.length == 4) {
	words = fourwords;
} else if (answer.length == 5) {
	words = fivewords;
} else {
	words = sixwords;
}

if (answer.length <= 5) {
	for (let i = 0; i < 0 - (answer.length - 5); i++) {
		const nodeList = document.querySelectorAll('.container > *');
		for (let i = 0; i < nodeList.length; i++) {
			nodeList[i].removeChild(nodeList[i].lastElementChild);
		}
	}
} else {
	for (let i = 0; i < answer.length - 5; i++) {
		const nodeList = document.querySelectorAll('.container > *');
		for (let i = 0; i < nodeList.length; i++) {
			nodeList[i].appendChild(document.createElement('div'));
		}
	}
}

if (localStorage.getItem(`${localstorage_num}_date`) == Math.floor(Difference_In_Days)) {
  answer_word(localStorage.getItem(`${localstorage_num}_words`))
}

if (localStorage.hasOwnProperty(`${localstorage_num}_words`)) {
	if (localStorage.getItem(`${localstorage_num}_words`).includes(answer)) {
		winGame();
	}
}

for (let i = 0; i < answer.length - 3; i++) {
	document.querySelector('.container > div:last-child').remove();
}

container.style.display = 'grid';

console.log(`The answer is ${answer}!`);

let current_guess = 0;
let score = 0;

function answer_word(word_str) {
  let wordsfo = [];
  for (let i = 0; i < word_str.length / answer.length; i++) {
    wordsfo.push(word_str.slice((i) * answer.length, (i + 1) * answer.length));
  }
  let a = 0;
  let b = 0;
  for (let i = 0; i < word_str.length; i++) {
    if (b == answer.length) {
      b = 0;
      a++;
    };
    if (wordsfo[a].charAt(b) == answer.charAt(b)) {
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).style.backgroundColor = 'var(--green)';
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).style.border = '2px solid var(--green)';
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).innerHTML = wordsfo[a].charAt(b);
    } else if (answer.includes(wordsfo[a].charAt(b))) {
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).style.backgroundColor = 'var(--yellow)';
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).style.border = '2px solid var(--yellow)';
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).innerHTML = wordsfo[a].charAt(b);
    } else {
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).style.backgroundColor = 'var(--gray)';
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).style.border = '2px solid var(--gray)';
      document.querySelector(`.container > div:nth-child(${a + 1}) > div:nth-child(${b + 1})`).innerHTML = wordsfo[a].charAt(b);
    }
    b++;
  }
}

localStorage.setItem(`${localstorage_num + 1}_date`, Math.floor(Difference_In_Days));

function press(key) {
	if (animating == true) return;
	key = key || '';
	let answer1 = `${answer}`;
	const current_active_tile = document.getElementById('active');
	if (key === 'Backspace') {
		current_active_tile.innerHTML = '';
		if (current_active_tile.previousElementSibling != null) {
			current_active_tile.previousElementSibling.id = 'active';
			current_active_tile.removeAttribute('id');
		}
	} else {
		if (!(key.toLowerCase() >= 'a' && key.toLowerCase() <= 'z') || (key.length > 1 && key != 'Enter')) return;
		if (current_active_tile.innerHTML != '' && current_active_tile.nextElementSibling != null) {
			if (key == 'Enter') return;
			current_active_tile.nextElementSibling.id = 'active';
			current_active_tile.removeAttribute('id');
			current_active_tile.nextElementSibling.innerHTML = key;
		} else if (current_active_tile.nextElementSibling === null && current_active_tile != null) {
      if (key != 'Enter') return;
			let word = '';
			for (let i = 0; i < current_active_tile.parentElement.childElementCount; i++) {
				word += document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:nth-child(${i + 1})`).innerHTML.toLowerCase();
			}
			if (!words.includes(word)) return;
      animating = true;
      if (localStorage.hasOwnProperty(`${localstorage_num + 1}_words`)) {
        localStorage.setItem(`${localstorage_num + 1}_words`, localStorage.getItem(`${localstorage_num + 1}_words`) + word);
      } else {
        localStorage.setItem(`${localstorage_num + 1}_words`, word);
      }
			current_active_tile.removeAttribute('id');
			let a = current_active_tile.parentElement.nextElementSibling || '';
			if (a != '') {
				current_active_tile.parentElement.nextElementSibling.firstElementChild.id = 'active';
			}
			current_guess++;
			for (let i = 0; i < answer.length; i++) {
				i_n(current_active_tile, i).classList.add('animate');
				if (i_n(current_active_tile, i).innerHTML.toLowerCase() === answer.charAt(i)) {
					score += 1;
					i_n(current_active_tile, i).classList.add('green');
					document.querySelector(`.container > .${current_active_tile.parentElement.className}`).lastElementChild.addEventListener('animationend', () => {
						document.getElementById(i_n(current_active_tile, i).innerHTML).style.backgroundColor = 'var(--green)';
						document.getElementById(i_n(current_active_tile, i).innerHTML).style.color = 'white';
					});
					answer1 = answer1.replace(
						document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:nth-child(${i + 1})`).innerHTML.toLowerCase(),
						''
					);
				}
			}
			document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:last-child`).addEventListener('animationend', () => {
				if (word == answer) {
					winGame();
				}
			});
			for (let i = 0; i < current_active_tile.parentElement.childElementCount; i++) {
				if (
					answer1.includes(i_n(current_active_tile, i).innerHTML.toLowerCase()) == true &&
					!(
						document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:nth-child(${i + 1})`).innerHTML.toLowerCase() ===
						answer.charAt(i)
					)
				) {
					score += 0.5;
					i_n(current_active_tile, i).classList.add('yellow');
					answer1 = answer1.replace(
						document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:nth-child(${i + 1})`).innerHTML.toLowerCase(),
						''
					);
					document.querySelector(`.container > .${current_active_tile.parentElement.className}`).lastElementChild.addEventListener('animationend', () => {
						if (document.getElementById(i_n(current_active_tile, i).innerHTML).style.backgroundColor != 'var(--green)') {
							document.getElementById(i_n(current_active_tile, i).innerHTML).style.backgroundColor = 'var(--yellow)';
							document.getElementById(i_n(current_active_tile, i).innerHTML).style.color = 'white';
						}
					});
				} else if (
					!(
						document.querySelector(`.container > .${current_active_tile.parentElement.className} > div:nth-child(${i + 1})`).innerHTML.toLowerCase() ===
						answer.charAt(i)
					)
				) {
					i_n(current_active_tile, i).classList.add('gray');
					document.querySelector(`.container > .${current_active_tile.parentElement.className}`).lastElementChild.addEventListener('animationend', () => {
						animating = false;
						if (document.getElementById(i_n(current_active_tile, i).innerHTML).style.backgroundColor === '') {
							document.getElementById(i_n(current_active_tile, i).innerHTML).style.backgroundColor = 'var(--gray)';
							document.getElementById(i_n(current_active_tile, i).innerHTML).style.color = 'white';
						}
					});
				}
			}
		} else {
			if (key == 'Enter') return;
			document.getElementById('active').innerHTML = key;
		}
	}
	for (let i = 0; i < answer.length; i++) {
		if (i_n(current_active_tile, i).innerHTML.toLowerCase() != '') {
			i_n(current_active_tile, i).classList.add('animate2');
		} else {
			i_n(current_active_tile, i).classList.remove('animate2');
			if (i_n(current_active_tile, i).classList == '') {
				i_n(current_active_tile, i).removeAttribute('class');
			}
		}
	}
}

function eventfunc(e) {
	press(e.key);
}

// Won Game
function winGame() {
  let points;
  let last_points;
  let second_to_last_points;
  let third_to_last_points;
  if (localStorage.getItem(`${localstorage_num}_date`) != Math.floor(Difference_In_Days)) {
    const empty_cells = document.querySelectorAll('.container > * > *:not(.animate)');
    const num_of_rows = container.childElementCount;
    points = Math.round(((score + empty_cells.length) / (answer.length * num_of_rows)) * lp + ((num_of_rows - (current_guess - 1)) / num_of_rows) * tp);

    // Localstorage Setting
    localStorage.setItem(localstorage_num + 1, points);

    last_points = localStorage.getItem(localstorage_num) || '0';
	  second_to_last_points = localStorage.getItem(localstorage_num - 1) || '0';
	  third_to_last_points = localStorage.getItem(localstorage_num - 2) || '0';
    document.querySelector('.points-section > div:nth-child(2) > p').innerHTML = `${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num}_date`)))).getMonth()}/${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num}_date`)))).getDate()}`;
    if (document.querySelector('.points-section > div:nth-child(2) > p').innerHTML == 'NaN/NaN') {
      document.querySelector('.points-section > div:nth-child(2) > p').innerHTML = '0/0'
    }
    document.querySelector('.points-section > div:nth-child(3) > p').innerHTML = `${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 1}_date`)))).getMonth()}/${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 1}_date`)))).getDate()}`;
    if (document.querySelector('.points-section > div:nth-child(3) > p').innerHTML == 'NaN/NaN') {
      document.querySelector('.points-section > div:nth-child(3) > p').innerHTML = '0/0'
    }
    document.querySelector('.points-section > div:nth-child(4) > p').innerHTML = `${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 2}_date`)))).getMonth()}/${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 2}_date`)))).getDate()}`;
    if (document.querySelector('.points-section > div:nth-child(4) > p').innerHTML == 'NaN/NaN') {
      document.querySelector('.points-section > div:nth-child(4) > p').innerHTML = '0/0'
    }
  } else {
    points = localStorage.getItem(localstorage_num)
    last_points = localStorage.getItem(localstorage_num - 1) || '0';
	  second_to_last_points = localStorage.getItem(localstorage_num - 2) || '0';
	  third_to_last_points = localStorage.getItem(localstorage_num - 3) || '0';
    document.querySelector('.points-section > div:nth-child(2) > p').innerHTML = `${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 1}_date`)))).getMonth()}/${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 1}_date`)))).getDate()}`;
    if (document.querySelector('.points-section > div:nth-child(2) > p').innerHTML == 'NaN/NaN') {
      document.querySelector('.points-section > div:nth-child(2) > p').innerHTML = '0/0'
    }
    document.querySelector('.points-section > div:nth-child(3) > p').innerHTML = `${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 2}_date`)))).getMonth()}/${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 2}_date`)))).getDate()}`;
    if (document.querySelector('.points-section > div:nth-child(3) > p').innerHTML == 'NaN/NaN') {
      document.querySelector('.points-section > div:nth-child(3) > p').innerHTML = '0/0'
    }
    document.querySelector('.points-section > div:nth-child(4) > p').innerHTML = `${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 3}_date`)))).getMonth()}/${new Date(new Date().setDate(beg_date.getDate() + parseInt(localStorage.getItem(`${localstorage_num - 3}_date`)))).getDate()}`;
    if (document.querySelector('.points-section > div:nth-child(4) > p').innerHTML == 'NaN/NaN') {
      document.querySelector('.points-section > div:nth-child(4) > p').innerHTML = '0/0'
    }
  }
	
  document.removeEventListener('keydown', eventfunc);
	modal.showModal();
	modal.style.transform = 'translateY(50px)';
	modal.style.opacity = '1';
	modal.style.translate = '0px -50px';
	document.querySelector('.points').innerHTML = points;

	document.querySelector('.points-section > div:nth-child(2) > div > p').innerHTML = last_points;
	document.querySelector('.points-section > div:nth-child(2) > div').style.width = `${parseInt(last_points) / 10}%`;
  if (270 * parseInt(last_points) / 10 < 16) {
    document.querySelector('.points-section > div:nth-child(2) > div > p').style.right = '0';
    document.querySelector('.points-section > div:nth-child(2) > div > p').style.transform = 'translateX(-50%)';
  }

	document.querySelector('.points-section > div:nth-child(3) > div > p').innerHTML = second_to_last_points;
	document.querySelector('.points-section > div:nth-child(3) > div').style.width = `${parseInt(second_to_last_points) / 10}%`;
  if (270 * parseInt(second_to_last_points) / 10 < 16) {
    document.querySelector('.points-section > div:nth-child(3) > div > p').style.right = '0';
    document.querySelector('.points-section > div:nth-child(3) > div > p').style.transform = 'translateX(-50%)';
  }

	document.querySelector('.points-section > div:nth-child(4) > div > p').innerHTML = third_to_last_points;
	document.querySelector('.points-section > div:nth-child(4) > div').style.width = `${parseInt(third_to_last_points) / 10}%`;
  if (270 * parseInt(third_to_last_points) / 10 < 16) {
    document.querySelector('.points-section > div:nth-child(4) > div > p').style.right = '0';
    document.querySelector('.points-section > div:nth-child(4) > div > p').style.transform = 'translateX(-50%)';
  }
}

// Add the Close Button Listener

document.getElementById('close-btn').addEventListener('click', () => {
	modal.style.opacity = '0';
	modal.style.translate = '0px 50px';
	setInterval(() => {
		modal.close();
	}, 300);
});

// Add the Keyboard Event Listeners

for (let i = 0; i < 26; i++) {
	const current_letter_button = document.getElementById(String.fromCharCode(i + 65).toLowerCase());
	current_letter_button.addEventListener('click', () => press(String.fromCharCode(i + 65).toLowerCase()));
}

document.getElementById('enter').addEventListener('click', () => press('Enter'));

document.getElementById('backspace').addEventListener('click', () => press('Backspace'));
