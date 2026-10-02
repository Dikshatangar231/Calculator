const prevLine = document.getElementById('prevLine');
const currentLine = document.getElementById('currentLine');

let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

function updateDisplay() {
  currentLine.textContent = current;
  prevLine.textContent = previous !== null && operator ? `${previous} ${symbolFor(operator)}` : '\u00A0';
}

function symbolFor(op) {
  return { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7', '%': '%' }[op] || op;
}

function inputNumber(n) {
  if (resetNext) { current = '0'; resetNext = false; }
  if (n === '.' && current.includes('.')) return;
  current = current === '0' && n !== '.' ? n : current + n;
}

function chooseOperator(op) {
  if (operator !== null) compute();
  previous = current;
  operator = op;
  resetNext = true;
}

function compute() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (isNaN(a) || isNaN(b)) return;
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    case '%': result = a % b; break;
    default: return;
  }
  current = result === 'Error' ? 'Error' : String(Math.round(result * 1e10) / 1e10);
  operator = null;
  previous = null;
  resetNext = true;
}

function clearAll() {
  current = '0'; previous = null; operator = null; resetNext = false;
}

function deleteLast() {
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

document.querySelectorAll('[data-num]').forEach(btn => {
  btn.addEventListener('click', () => { inputNumber(btn.dataset.num); updateDisplay(); });
});
document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => { chooseOperator(btn.dataset.op); updateDisplay(); });
});
document.querySelector('[data-action="equals"]').addEventListener('click', () => { compute(); updateDisplay(); });
document.querySelector('[data-action="clear"]').addEventListener('click', () => { clearAll(); updateDisplay(); });
document.querySelector('[data-action="delete"]').addEventListener('click', () => { deleteLast(); updateDisplay(); });

window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') { inputNumber(e.key); updateDisplay(); }
  else if (e.key === '.') { inputNumber('.'); updateDisplay(); }
  else if (['+', '-', '*', '/'].includes(e.key)) { chooseOperator(e.key); updateDisplay(); }
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); updateDisplay(); }
  else if (e.key === 'Backspace') { deleteLast(); updateDisplay(); }
  else if (e.key === 'Escape') { clearAll(); updateDisplay(); }
});

updateDisplay();