const CONFIG = {
    puntMida: 10,
    ample: 300,
    altura: 300,
    maxRand: 29,
    retard: 140,
    maxPunts: 900,
    teclat: {
      esquerra: 37,
      dreta: 39,
      amunt: 38,
      avall: 40,
    },
  };
  
  const estatJoc = {
    canvas: null,
    ctx: null,
    cap: null,
    cos: null,
    poma: { img: null, x: 0, y: 0 },
    direccio: { esquerra: false, dreta: true, amunt: false, avall: false },
    enMarxa: true,
    midaSerp: 3,
    posX: new Array(CONFIG.maxPunts),
    posY: new Array(CONFIG.maxPunts),
  };
  

  
  window.onload = initGame;
  // Inicialitza el joc
  function initGame() {
    estatJoc.canvas = document.getElementById('canvas');
    estatJoc.ctx = estatJoc.canvas.getContext('2d');
  
    estatJoc.cap = new Image();
    estatJoc.cap.src = 'head.png';
  
    estatJoc.cos = new Image();
    estatJoc.cos.src = 'dot.png';
  
    estatJoc.poma.img = new Image();
    estatJoc.poma.img.src = 'apple.png';
  
    for (let i = 0; i < estatJoc.midaSerp; i++) {
      estatJoc.posX[i] = 50 - i * CONFIG.puntMida;
      estatJoc.posY[i] = 50;
    }
  
    generaNovaPoma();
    setTimeout(bucleJoc, CONFIG.retard);
  }
  
  // Crea nova poma a lloc aleatori
  function generaNovaPoma() {
    const randX = Math.floor(Math.random() * CONFIG.maxRand);
    const randY = Math.floor(Math.random() * CONFIG.maxRand);
    estatJoc.poma.x = randX * CONFIG.puntMida;
    estatJoc.poma.y = randY * CONFIG.puntMida;
  }
  
  // Dibuixa la serp i la poma
  function dibuixa() {
    const { ctx, poma, posX, posY, midaSerp, cap, cos } = estatJoc;
  
    ctx.clearRect(0, 0, CONFIG.ample, CONFIG.altura);
    ctx.drawImage(poma.img, poma.x, poma.y);
  
    for (let i = 0; i < midaSerp; i++) {
      const imatge = i === 0 ? cap : cos;
      ctx.drawImage(imatge, posX[i], posY[i]);
    }
  }
  
  // Mostra el missatge de Game Over
  function mostrarGameOver() {
    const { ctx, midaSerp } = estatJoc;
    const punts = midaSerp - 3;
  
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${punts} ${punts === 1 ? 'punt' : 'punts'} - Game over`, CONFIG.ample / 2, CONFIG.altura / 2);
  }
  
  // Comprova si la poma ha estat menjada
  function comprovaPoma() {
    const { posX, posY, poma } = estatJoc;
  
    if (posX[0] === poma.x && posY[0] === poma.y) {
      estatJoc.midaSerp++;
      generaNovaPoma();
    }
  }
  
  // Comprova col·lisions amb parets o amb la pròpia serp
  function comprovaColisions() {
    const { posX, posY, midaSerp } = estatJoc;
  
    for (let i = midaSerp; i > 0; i--) {
      if (i > 4 && posX[0] === posX[i] && posY[0] === posY[i]) {
        return true;
      }
    }
  
    const foraMapa =
      posX[0] >= CONFIG.ample ||
      posX[0] < 0 ||
      posY[0] >= CONFIG.altura ||
      posY[0] < 0;
  
    return foraMapa;
  }
  
  // Mou la serp una posició
  function moure() {
    const { posX, posY, midaSerp, direccio } = estatJoc;
  
    for (let i = midaSerp; i > 0; i--) {
      posX[i] = posX[i - 1];
      posY[i] = posY[i - 1];
    }
  
    if (direccio.esquerra) posX[0] -= CONFIG.puntMida;
    if (direccio.dreta) posX[0] += CONFIG.puntMida;
    if (direccio.amunt) posY[0] -= CONFIG.puntMida;
    if (direccio.avall) posY[0] += CONFIG.puntMida;
  }
  
  // Bucle principal del joc
  function bucleJoc() {
    if (!estatJoc.enMarxa) return;
  
    comprovaPoma();
  
    if (comprovaColisions()) {
      estatJoc.enMarxa = false;
      mostrarGameOver();
      return;
    }
  
    moure();
    dibuixa();
    setTimeout(bucleJoc, CONFIG.retard);
  }
  
  // Control de tecles
  document.addEventListener('keydown', (e) => {
    const tecla = e.keyCode;
    const d = estatJoc.direccio;
  
    if (tecla === CONFIG.teclat.esquerra && !d.dreta) {
      d.esquerra = true; d.dreta = d.amunt = d.avall = false;
    } else if (tecla === CONFIG.teclat.dreta && !d.esquerra) {
      d.dreta = true; d.esquerra = d.amunt = d.avall = false;
    } else if (tecla === CONFIG.teclat.amunt && !d.avall) {
      d.amunt = true; d.esquerra = d.dreta = d.avall = false;
    } else if (tecla === CONFIG.teclat.avall && !d.amunt) {
      d.avall = true; d.esquerra = d.dreta = d.amunt = false;
    }
  });
  