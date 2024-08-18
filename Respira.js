function setup() {
  createCanvas(400, 400);
  noFill();
  stroke(255);
  strokeWeight(2);
}

function draw() {
  background(0);
  
  let t = millis() / 1000; // Tiempo en segundos
  
  // Función de respiración
  let breathe = sin(t * PI / 4); // Oscilación lenta para simular respiración
  let size = map(breathe, -1, 1, 100, 300); // Mapeo de la respiración a un tamaño de círculo
  
  // Dibujar el círculo
  ellipse(width / 2, height / 2, size, size);
}