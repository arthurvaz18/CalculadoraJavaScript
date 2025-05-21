const visor = document.getElementById('areaNumerica');
const errorDivisaoZero = document.querySelector('.divisaoPorZero'); //aciona mensagem do erro numero/0
const maximoDigito = 20;
let expressao = '';

function atualizarVisor() {
  visor.textContent = expressao || '0';

  errorDivisaoZero.style.display = 'none';
  errorDivisaoZero.textContent = '';
}

function inserirNumero(numero) {
  if(expressao.length < maximoDigito){
    expressao += numero;
  }
  atualizarVisor();
}

function inserirOperador(operador) {
  const ultimo = expressao.slice(-1);

  if (['+', '-', '*', '/'].includes(ultimo)) {
    expressao = expressao.slice(0, -1);
  }
  if (expressao === '' && operador !== '-') return;

  expressao += operador;
  atualizarVisor();
}

function limpar() {
  expressao = '';
  atualizarVisor();
}

function calcular(){
  try{
    const resultado = calcularporExpressao(expressao);
    expressao = Math.floor(resultado).toString();
    atualizarVisor();
  } catch (e){
    if (e.message === "Divisão por zero") {
      errorDivisao("Não é possível dividir por zero");
      visor.textContent = '0';
    } else {
      visor.textContent = "Erro";
      limparErrorDivisao();
    }
    expressao = '';
  }
}

function calcularporExpressao(calculaExpr) {
  const numeros = [];
  const operadores = [];

  let numeroAtual = '';

  //percorre todo o array atrás dos caracteres
  for (let i = 0; i < calculaExpr.length; i++) {
    const caractere = calculaExpr[i];

    if (entradaNumero(caractere) || caractere === '.') {
      numeroAtual += caractere; 
    } else if (entradaOperador(caractere)) {

      //trata numero negativo no começo ou no final da expressao
      if (numeroAtual === '') {
        if (caractere === '-' && (i === 0 || entradaOperador(calculaExpr[i - 1]))) {
          numeroAtual = '-';
          continue;
        } else {
          throw new Error('Expressão inválida');
        }
      }

      numeros.push(parseFloat(numeroAtual));
      operadores.push(caractere);            
      numeroAtual = '';                      
    }
  }

  //adiciona mais numeros na expressão
  if (numeroAtual !== '') {
    numeros.push(parseFloat(numeroAtual));
  }

  //for para resolver primeiro a multiplicacao e divisao
  for (let i = 0; i < operadores.length; i++) {
    const operador = operadores[i];

    if (operador === '*' || operador === '/') {
      const a = numeros[i];
      const b = numeros[i + 1];

      if (operador === '/' && b === 0) throw new Error("Divisão por zero");

      const resultado = operador === '*' ? a * b : a / b;

      numeros.splice(i, 2, resultado);   
      operadores.splice(i, 1);           
      i--;                               
    }
  }

  //operacao adicionar e subtrair
  let resultadoFinal = numeros[0];
  for (let i = 0; i < operadores.length; i++) {
    const operador = operadores[i];
    const proximoNumero = numeros[i + 1];

    if (operador === '+') resultadoFinal += proximoNumero;
    if (operador === '-') resultadoFinal -= proximoNumero;
  }

  return resultadoFinal;
}

//para saber se é numero
function entradaNumero(caractere) {
  return caractere >= '0' && caractere <= '9';
}

//para saber se é operador
function entradaOperador(caractere) {
  return ['+', '-', '*', '/'].includes(caractere);
}

//trata erro de divisao
function errorDivisao(divisao){
  errorDivisaoZero.textContent = divisao;
  errorDivisaoZero.style.display = 'block';
}

//limpar dados 
function limparErrorDivisao(){
  errorDivisaoZero.textContent = '';
  errorDivisaoZero.style.display = 'none';
}

//reinicia o visor para uma nova conta(expressao)
atualizarVisor();



//entrada de dados pelo meu teclado
document.addEventListener('keydown', (evento) => {
  const tecla = evento.key;

  if (tecla === 'Enter') {
    calcular();
  } else if (tecla === 'Escape') {
    limpar();
  } else if (entradaNumero(tecla) || tecla === '.') {
    inserirNumero(tecla);
  } else if (entradaOperador(tecla)) {
    inserirOperador(tecla); 
  } else if (tecla === 'Backspace') {
    expressao = expressao.slice(0, -1);
    atualizarVisor();
  }
});