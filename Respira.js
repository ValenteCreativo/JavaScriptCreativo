//Title: RESPIRA.
//Sal de la tormenta un momento. Tómate 40 segundos para volver a ti. 

function setup() {
  createCanvas(600, 600);
  noFill();
  stroke(255);
  strokeWeight(2);
}

function draw() {
  background(0);
  
  let t = millis() / 1000; // Tiempo en segundos
  
  // Función de respiración
  let breathe = sin(t * PI / 4); // Oscilación para inhalar y exhalar.
  let size = map(breathe, -1, 1, 100, 250); // Mapeo para calmar la mente...
  
  // Dibujar el círculo
  ellipse(width / 2, height / 2, size, size);
}
//@ValenteCreativo
