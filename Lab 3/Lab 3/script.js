let current = '';
let operator = '';
let previous = '';
let last = null;
let activeBtn = null;
const DECIMALS = 3;

// display the nums
function append_n(number) {
    if (number === '.' && current.includes('.')) return;
    if (current === '' && number === '.'){
        current = '0.';
    } else{
        current += number;
    }
    document.getElementById('display').textContent = current;
    if (activeBtn) { 
        activeBtn.classList.remove('active'); activeBtn = null; 
    }
}

// calc the nums
function sum(a, op, b) {
    if (op === '+'){
        return a + b;
    }if (op === '-'){
        return a - b;
    }if (op === '*'){
      return a * b;
    }if (op === '/'){ 
        return b === 0 ? NaN : a / b;
    } return b;
}

//round answer by 5
function round(x) {
  if (!Number.isFinite(x)) return 'Error';      // e.g., divide by zero
  return (+x.toFixed(DECIMALS)).toString();     // rounds & trims trailing zeros
}

//save result and last operand for repeat and clear current
function internalCalc() {
    if (!operator || previous === '') return;
    const a = parseFloat(previous);
    let b;

    if (current === '') {
        if (last == null) return;
        b = last;
    } else {
        b = parseFloat(current);
        last = b;
    }

    const out_put = round(sum(a, operator, b));
    document.getElementById('display').textContent = String(out_put);
    previous = String(out_put);
    current = '';
}

//calculate and highlight
function calc() {
    internalCalc();
    if (activeBtn) { 
        activeBtn.classList.remove('active'); 
        activeBtn = null; 
    }
}

// highlighs the buttons 
function setOperator(op, btn) {
    if (previous !== '' && current !== '') {
        internalCalc();
    }
    operator = op;
    previous = previous || current || '0';
    current = '';

    if (activeBtn){
        activeBtn.classList.remove('active');
    }
    if (btn) {
       activeBtn = btn; activeBtn.classList.add('active'); 
    }
}

//clear 
function clear_nums() {
    current = '';
    previous = '';
    operator = '';
    last = null;                 
    if (activeBtn) {             
        activeBtn.classList.remove('active');
        activeBtn = null;
    }
    document.getElementById('display').textContent = '0';
}

// make sure dont go out of screen 
function fitDisplay() {
    const screen = document.getElementById('display');
    if (!screen) return;
    screen.style.fontSize = '';                     
    // reset to CSS default
    let size = parseInt(getComputedStyle(screen).fontSize, 10) || 24;
    while (el.scrollWidth > el.clientWidth && size > 16) {
        size -= 1;
        el.style.fontSize = size + 'px';
    }
}
//check again 
setInterval(fitDisplay, 50); 