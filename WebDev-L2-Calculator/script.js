
const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let currentInput = '0';
let previousValue = null;
let currentOperator = null;
let expressionText = '';
let justEvaluated = false;

function updateDisplay() {
  resultEl.textContent = currentInput;
  expressionEl.textContent = expressionText;
}

function inputNumber(num) {
  if (justEvaluated) {
    currentInput = '0';
    expressionText = '';
    justEvaluated = false;
  }
  if (num === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function inputOperator(op) {
  if (currentOperator !== null && !justEvaluated) {
    evaluate();
  }
  previousValue = parseFloat(currentInput);
  currentOperator = op;
  expressionText = `${formatNum(previousValue)} ${opSymbol(op)}`;
  currentInput = '0';
  justEvaluated = false;
  updateDisplay();
}

function opSymbol(op) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
}

function formatNum(n) {
  if (Number.isInteger(n)) return n.toString();
  return parseFloat(n.toFixed(8)).toString();
}

function evaluate() {
  if (currentOperator === null || previousValue === null) return;
  const curr = parseFloat(currentInput);
  let result;

  if (currentOperator === '/' && curr === 0) {
    resultEl.textContent = "Can't divide by zero";
    expressionText = '';
    currentInput = '0';
    previousValue = null;
    currentOperator = null;
    justEvaluated = true;
    expressionEl.textContent = expressionText;
    return;
  }

  switch (currentOperator) {
    case '+': result = previousValue + curr; break;
    case '-': result = previousValue - curr; break;
    case '*': result = previousValue * curr; break;
    case '/': result = previousValue / curr; break;
    default: return;
  }

  expressionText = `${formatNum(previousValue)} ${opSymbol(currentOperator)} ${formatNum(curr)} =`;
  currentInput = formatNum(result);
  previousValue = null;
  currentOperator = null;
  justEvaluated = true;
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  previousValue = null;
  currentOperator = null;
  expressionText = '';
  justEvaluated = false;
  updateDisplay();
}

function backspace() {
  if (justEvaluated) return;
  if (currentInput.length <= 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function percent() {
  currentInput = formatNum(parseFloat(currentInput) / 100);
  updateDisplay();
}

document.querySelectorAll('.btn.number').forEach(btn => {
  btn.addEventListener('click', () => inputNumber(btn.dataset.num));
});

document.querySelectorAll('.btn.operator').forEach(btn => {
  btn.addEventListener('click', () => inputOperator(btn.dataset.op));
});

document.getElementById('equals').addEventListener('click', evaluate);
document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('backspace').addEventListener('click', backspace);
document.getElementById('percent').addEventListener('click', percent);

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if (e.key === '.') inputNumber('.');
  else if (['+', '-', '*', '/'].includes(e.key)) inputOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') evaluate();
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') clearAll();
});

updateDisplay();