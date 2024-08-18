let arrowReady = false; //TITLE: El OBJETIVO
let arrowX = 130; // A veces el ruido en nuestra mente nos dirá que no podemos... 
let arrowY = 325;
let arrowShake = 0;
let thoughts = [
  "Voy a fallar", "No puedo hacerlo", "Es demasiado difícil",
  "No soy suficiente", "Esto es imposible", "¿Qué pensarán de mí?",
  "¿Y si no lo logro?", "No es el momento adecuado", "Me falta preparación",
];
let currentThought = 0;
let firstThoughtDelay = 180;
let thoughtOpacity = 0;
let calm = false;
let calmingFrame = 0; //Respira. Concéntrate. Sí puedes. 
let arrowSpeed = 6; //Intenciona tu flecha. 
let arrowVisible = false;
let showSilence = false;
let showSilenceFrame = 0;
let silenceDuration = 6000;
let finalDuration = 10000;
let breathingCircleScale = 150;
let breathing = false;
let breathingOpacity = 0;  
let breathingStartTime = 0;
let particles = []; //Sí eres suficiente. Confía en ti. 
let shootingStar = null; 
//@ValenteCreativo

function setup() {
  createCanvas(1000, 800); 
  setTimeout(() => {
    arrowVisible = true; 
    setTimeout(() => { 
      arrowReady = true;
    }, 3000);
  }, 3000);
}

function draw() {
  background(0);
  drawStaticUniverseBackground();
  drawTarget();
  drawArcher();
  drawParticles();

  if (arrowReady) {
    drawArrow();
    if (!calm) {
      showThoughts();
      shakeArrow();
    } else {
      if (showSilence) {
        drawSilenceMessage();
      } else if (breathing) {
        drawBreathingCircle();
      } else {
        shootArrow();
      }
    }
  } else if (arrowVisible) {
    drawArrow();
  }

  if (arrowReady && !calm) {
    calmingFrame++;
    if (calmingFrame > 720) { // Aumentado para prolongar el tiempo entre showThoughts y showSilence
      calm = true;
      showSilence = true;
      setTimeout(() => {
        showSilence = false;
        startBreathing();
      }, silenceDuration);
    }
  }
}

function drawStaticUniverseBackground() {
  noStroke();
  fill(255, 255, 255, 30);
  for (let i = 0; i < 100; i++) {
    ellipse(random(width), random(height), random(1, 3));
  }
}

function drawTarget() {
  stroke(192, 192, 192);
  noFill();
  ellipse(710, 325, 50, 50);
  ellipse(710, 325, 30, 30);
  ellipse(710, 325, 10, 10);
  
  // Efecto de luz alrededor del objetivo
  noStroke();
  for (let i = 50; i >= 10; i -= 10) {
    fill(255, 255, 255, 15);
    ellipse(710, 325, i * 3, i * 3);
  }
}

function drawArcher() {
  fill(192, 192, 192);
  rect(100, 325, 20, 100);
  ellipse(110, 305, 40, 40);

  stroke(192, 192, 192);
  noFill();
  arc(120, 325, 60, 100, -PI / 2, PI / 2);

  // Efecto de resplandor alrededor del arquero
  noStroke();
  fill(255, 255, 255, 20);
  ellipse(110, 305, 60, 60);
}

function drawArrow() {
  stroke(192, 192, 192);
  line(arrowX + arrowShake, arrowY, arrowX + 30 + arrowShake, arrowY);
  fill(192, 192, 192);
  triangle(arrowX + 30 + arrowShake, arrowY - 3, arrowX + 30 + arrowShake, arrowY + 3, arrowX + 35 + arrowShake, arrowY);
}

function showThoughts() {
  fill(192, 192, 192);
  textSize(16);
  
  let displayText = thoughts[currentThought];
  let textX = 100;
  
  // Ajuste específico para el primer pensamiento
  if (currentThought === 0 && calmingFrame < firstThoughtDelay) {
    text(displayText, textX, 225);
  } else if (calmingFrame >= firstThoughtDelay || currentThought !== 0) {
    let intensity = map(calmingFrame, 0, 360, 0, 1);
    let thoughtShake = sin(frameCount * 0) * intensity;
    translate(thoughtShake, 0);
    text(displayText, textX, 225);

    if (frameCount % 120 === 0) { // Mantener el tiempo para otros pensamientos
      currentThought = (currentThought + 1) % thoughts.length;
    }
  }
}
function drawSilenceMessage() {
  textSize(24);
  textAlign(CENTER, CENTER);
  
  let fadeDuration = 60; // Duración de cada fase del fade
  let opacity;
  
  if (showSilenceFrame <= fadeDuration) {  // Fase de fade-in
    opacity = map(showSilenceFrame, 0, fadeDuration, 0, 255);
  } else if (showSilenceFrame > silenceDuration - fadeDuration) {  // Fase de fade-out
    opacity = map(showSilenceFrame, silenceDuration - fadeDuration, silenceDuration, 255, 0);
  } else {  // Mantener visible durante el tiempo restante
    opacity = 255;
  }
  
  fill(192, 192, 192, opacity);
  text("¡Silencio!", 110, 225);
  
  showSilenceFrame++;
  
  // Mover a la siguiente fase después del fade-out
  if (showSilenceFrame > silenceDuration) {
    showSilence = false;
    startBreathing(); 
    showSilenceFrame = 0; 
  }
}

function startBreathing() {
  breathing = true;
  breathingOpacity = 0;  // Resetear opacidad
  breathingStartTime = millis(); // Guardar el tiempo de inicio
  setTimeout(() => {
    breathing = false;
    shootArrow();
  }, 6000);
}

function drawBreathingCircle() {
  let elapsedTime = millis() - breathingStartTime;
  
  // Aumentar gradualmente la opacidad
  breathingOpacity = lerp(0, 255, elapsedTime / 1000); 
  breathingOpacity = constrain(breathingOpacity, 0, 255);
  
  // Movimiento consistente del círculo
  stroke(192, 192, 192, breathingOpacity);
  noFill();
  let scale = map(sin(elapsedTime / 1250), -1, 2, 80, 280);
  ellipse(110, 325, scale, scale);
}

function shootArrow() {
  arrowX += arrowSpeed;
  
  if (arrowX >= 675) { // La flecha ha llegado al objetivo
    arrowSpeed = 0;
    arrowX = 675; // Mueve la flecha a la nueva posición final
    particles.push(new MagicalEffect(710, 325)); // Mueve el efecto mágico a la nueva posición del objetivo
    
    // Iniciar la animación de la ShootingStar aquí
    if (!shootingStar) {
      shootingStar = new ShootingStar();
    }

    setTimeout(() => {
      arrowX = 130;
      arrowSpeed = 6;
      calm = false;
      arrowReady = false;
      calmingFrame = 0;
      showSilenceFrame = 0;
      setTimeout(() => {
        arrowVisible = true;
        setTimeout(() => {
          arrowReady = true;
        }, 500);
      }, 4000);
    }, finalDuration);
  }
}


function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  if (shootingStar) {
    shootingStar.update();
    shootingStar.show();
    if (shootingStar.isFinished()) {
      shootingStar = null;
    }
  }
}

function shakeArrow() {
  arrowShake = sin(frameCount * 5) * 0.5; // Temblor más suave de la flecha
}

class MagicalEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lifespan = 255;
    this.size = 10;
  }

  update() {
    this.lifespan -= 5;
    this.size += 2;
  }

  show() {
    noFill();
    stroke(192, 192, 192, this.lifespan);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}

class ShootingStar {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.len = random(50, 100);
    this.speed = random(2, 5);
    this.angle = random(PI / 6, PI / 3);
    this.opacity = 355;
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
    this.opacity -= 5;
  }

  show() {
    stroke(192, 192, 192, this.opacity);
    line(this.x, this.y, this.x - this.len * cos(this.angle), this.y - this.len * sin(this.angle));
  }

  isFinished() {
    return this.opacity <= 0;
  }
}
