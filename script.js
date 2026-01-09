// DOM Elements
const startBtn = document.querySelector('.start-btn');
const startScreen = document.querySelector('.start-screen');
const transitionScreen = document.querySelector('.transition-screen');
const scene = document.querySelector('.scene');
const backgroundMusic = document.getElementById('backgroundMusic');
const dholBeats = document.getElementById('dholBeats');
const starsContainer = document.getElementById('stars');
const cursorFire = document.getElementById('cursorFire');
const fireContainer = document.getElementById('fireContainer');
const flame1 = document.getElementById('flame1');
const flame2 = document.getElementById('flame2');
const flame3 = document.getElementById('flame3');
const village = document.getElementById('village');
const greetingContainer = document.getElementById('greetingContainer');
const musicToggle = document.getElementById('musicToggle');
const fireworksToggle = document.getElementById('fireworksToggle');
const crackersToggle = document.getElementById('crackersToggle');
const crackerContainer = document.getElementById('crackerContainer');

// State variables
let audioContext, analyser, dataArray;
let mouseX = 0, mouseY = 0;
let lastMouseX = 0, lastMouseY = 0;
let isMusicPlaying = true;
let isFireworksActive = true;
let isCrackersActive = true;
let beatTimer = 0;
let crackerInterval;

// Create stars
function createStars() {
  const starCount = window.innerWidth < 768 ? 150 : 300;
  for(let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 80}%`;
    star.style.width = `${Math.random() * (window.innerWidth < 480 ? 3 : 4) + 1}px`;
    star.style.height = star.style.width;
    star.style.setProperty('--duration', `${Math.random() * 5 + 2}s`);
    starsContainer.appendChild(star);
  }
}

// Create cracker effect
function createCracker() {
  if (!isCrackersActive) return;
  
  const x = Math.random() * 100;
  const y = Math.random() * 40 + 30;
  
  // Create cracker line
  const crackerLine = document.createElement('div');
  crackerLine.className = 'cracker-line';
  crackerLine.style.left = `${x}%`;
  crackerLine.style.top = `${y}%`;
  crackerContainer.appendChild(crackerLine);
  
  // Create explosion after line rises
  setTimeout(() => {
    // Remove line
    crackerLine.remove();
    
    // Create explosion sparks
    for(let i = 0; i < 12; i++) {
      const spark = document.createElement('div');
      spark.className = 'cracker-spark';
      spark.style.left = `${x}%`;
      spark.style.top = `${y - 10}%`;
      spark.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
      spark.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
      spark.style.background = i % 3 === 0 ? '#ffcc00' : i % 3 === 1 ? '#ff6600' : '#ff3300';
      spark.style.width = `${Math.random() * 4 + 2}px`;
      spark.style.height = spark.style.width;
      
      crackerContainer.appendChild(spark);
      
      // Remove spark after animation
      setTimeout(() => {
        if (spark.parentNode) {
          spark.remove();
        }
      }, 1000);
    }
    
  }, 500);
}

// Transition flow
startBtn.onclick = () => {
  startScreen.style.display = "none";
  transitionScreen.style.display = "flex";
  
  // Play transition animation
  setTimeout(() => {
    transitionScreen.style.opacity = "0";
    transitionScreen.style.transition = "opacity 1.5s ease";
    
    setTimeout(() => {
      transitionScreen.style.display = "none";
      scene.style.display = "block";
      
      // Start music
      backgroundMusic.volume = 0.7;
      dholBeats.volume = 0.5;
      backgroundMusic.play().catch(e => console.log("Autoplay prevented:", e));
      setTimeout(() => dholBeats.play(), 1000);
      
      // Initialize effects
      initAudioAnalysis();
      createStars();
      initCursorFire();
      initParallax();
      
      // Start cracker animations
      crackerInterval = setInterval(() => {
        if(isCrackersActive && Math.random() > 0.5) createCracker();
      }, 800);
      
      // Add fireworks
      setInterval(() => {
        if(isFireworksActive && Math.random() > 0.6) spawnFirework();
      }, 800);
    }, 1500);
  }, 3000);
};

// Initialize audio analysis for beat sync
function initAudioAnalysis() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(dholBeats);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    // Start beat detection loop
    detectBeat();
  } catch (e) {
    console.log("Audio analysis not supported:", e);
  }
}

// Beat detection and flame sync
function detectBeat() {
  if (!analyser) return;
  
  analyser.getByteFrequencyData(dataArray);
  
  // Get low frequency range for beat detection (bass)
  let lowFreq = 0;
  for (let i = 0; i < 20; i++) {
    lowFreq += dataArray[i];
  }
  lowFreq /= 20;
  
  // Detect strong beat
  const isStrongBeat = lowFreq > 180;
  
  // Get overall volume
  const averageVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
  
  // Scale flames based on volume
  const flameScale = 0.8 + (averageVolume / 255) * 0.8;
  flame1.style.height = `${240 * flameScale}px`;
  flame2.style.height = `${190 * flameScale}px`;
  flame3.style.height = `${150 * flameScale}px`;
  
  // Adjust for mobile
  if (window.innerWidth < 768) {
    flame1.style.height = `${190 * flameScale}px`;
    flame2.style.height = `${150 * flameScale}px`;
    flame3.style.height = `${120 * flameScale}px`;
  }
  if (window.innerWidth < 480) {
    flame1.style.height = `${150 * flameScale}px`;
    flame2.style.height = `${120 * flameScale}px`;
    flame3.style.height = `${90 * flameScale}px`;
  }
  
  // Add fire reaction on strong beat
  if (isStrongBeat) {
    beatTimer = 10;    
    // Spawn mini fireworks on beat
    if(isFireworksActive && Math.random() > 0.7) {
      spawnMiniFirework();
    }
    
    // Spawn cracker on beat
    if(isCrackersActive && Math.random() > 0.8) {
      createCracker();
    }
  }
  
  // Smooth scale back
  if(beatTimer > 0) {
    beatTimer--;
  } else {
    fireContainer.style.transform = `translateX(-50%) scale(1)`;
  }
  
  requestAnimationFrame(detectBeat);
}

// Cursor-based fire reaction
function initCursorFire() {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Calculate mouse speed for fire reaction
    const speedX = Math.abs(mouseX - lastMouseX);
    const speedY = Math.abs(mouseY - lastMouseY);
    const speed = Math.sqrt(speedX * speedX + speedY * speedY);
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    // Move cursor fire with trail effect
    cursorFire.style.left = `${mouseX - 20}px`;
    cursorFire.style.top = `${mouseY - 20}px`;
    cursorFire.style.opacity = Math.min(0.8, speed / 50).toString();
    cursorFire.style.transform = `scale(${1 + speed / 200})`;
    
    // Fire reacts to cursor proximity
    const fireRect = fireContainer.getBoundingClientRect();
    const fireCenterX = fireRect.left + fireRect.width / 2;
    const fireCenterY = fireRect.top + fireRect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - fireCenterX, 2) + 
      Math.pow(mouseY - fireCenterY, 2)
    );
    
    // Create spark trail on fast movement
    if(speed > 30 && Math.random() > 0.7) {
      createSpark(mouseX, mouseY);
    }
  });
  
  // Click to create fire burst
  document.addEventListener('click', (e) => {
    createFireBurst(e.clientX, e.clientY);
  });
}

// Create spark at mouse position
function createSpark(x, y) {
  const spark = document.createElement('div');
  spark.style.position = 'fixed';
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.width = '4px';
  spark.style.height = '4px';
  spark.style.background = '#ff9900';
  spark.style.borderRadius = '50%';
  spark.style.boxShadow = '0 0 10px #ff6600';
  spark.style.zIndex = '10';
  spark.style.pointerEvents = 'none';
  
  scene.appendChild(spark);
  
  // Animate spark
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50 + 20;
  const animation = spark.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
  ], {
    duration: 500,
    easing: 'ease-out'
  });
  
  animation.onfinish = () => spark.remove();
}

// Create fire burst on click
function createFireBurst(x, y) {
  for(let i = 0; i < 8; i++) {
    setTimeout(() => {
      const burst = document.createElement('div');
      burst.style.position = 'fixed';
      burst.style.left = `${x - 15}px`;
      burst.style.top = `${y - 15}px`;
      burst.style.width = '30px';
      burst.style.height = '30px';
      burst.style.background = `radial-gradient(circle, #ff8800, #ff3300 ${70 - i*5}%, transparent 80%)`;
      burst.style.borderRadius = '50%';
      burst.style.zIndex = '10';
      burst.style.pointerEvents = 'none';
      burst.style.opacity = '0.8';
      
      scene.appendChild(burst);
      
      // Animate burst
      const angle = (i / 8) * Math.PI * 2;
      const distance = 60;
      burst.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
        { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
      ], {
        duration: 600,
        easing: 'ease-out'
      }).onfinish = () => burst.remove();
    }, i * 30);
  }
}

// 3D Parallax effect
function initParallax() {
  let lastTime = 0;
  
  function updateParallax(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Calculate parallax based on mouse position (center is 0,0)
    const parallaxX = (mouseX / window.innerWidth - 0.5) * 40;
    const parallaxY = (mouseY / window.innerHeight - 0.5) * 20;
    
    greetingContainer.style.transform = `
      translateX(${parallaxX * 0.3}px)
      translateY(${parallaxY * 0.2}px)
    `;
    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);
}

// Fireworks
function spawnFirework() {
  const f = document.createElement('div');
  f.className = 'firework';
  f.style.left = Math.random() * 100 + '%';
  f.style.top = Math.random() * 40 + 30 + '%';
  f.style.setProperty('--x', (Math.random() * 400 - 200) + 'px');
  f.style.setProperty('--y', (Math.random() * -300 - 100) + 'px');
  f.style.background = `radial-gradient(circle, #${Math.floor(Math.random()*16777215).toString(16)}, #ff9900)`;
  f.style.width = `${Math.random() * 20 + 4}px`;
  f.style.height = f.style.width;
  scene.appendChild(f);
  setTimeout(() => f.remove(), 1400);
}

function spawnMiniFirework() {
  const f = document.createElement('div');
  f.className = 'firework';
  f.style.left = Math.random() * 100 + '%';
  f.style.top = '70%';
  f.style.setProperty('--x', (Math.random() * 200 - 100) + 'px');
  f.style.setProperty('--y', (Math.random() * -150 - 50) + 'px');
  f.style.background = `radial-gradient(circle, #ffcc00, #ff6600)`;
  f.style.width = '14px';
  f.style.height = '14px';
  scene.appendChild(f);
  setTimeout(() => f.remove(), 1000);
}

// Control handlers
musicToggle.addEventListener('click', () => {
  isMusicPlaying = !isMusicPlaying;
  if(isMusicPlaying) {
    // backgroundMusic.play();
    dholBeats.play();
    musicToggle.textContent = '🎵 Music On';
  } else {
    // backgroundMusic.pause();
    dholBeats.pause();
    musicToggle.textContent = '🎵 Music Off';
  }
});

fireworksToggle.addEventListener('click', () => {
  isFireworksActive = !isFireworksActive;
  if(isFireworksActive) {
    backgroundMusic.play();
    fireworksToggle.textContent = isFireworksActive ? '🎆 Fireworks On' : '🎆 Fireworks Off';
  } else {
    backgroundMusic.pause();
    fireworksToggle.textContent = isFireworksActive ? '🎆 Fireworks On' : '🎆 Fireworks Off';
  }
});

crackersToggle.addEventListener('click', () => {
  isCrackersActive = !isCrackersActive;
  crackersToggle.textContent = isCrackersActive ? '🧨 Crackers On' : '🧨 Crackers Off';
  
  if (isCrackersActive && !crackerInterval) {
    crackerInterval = setInterval(() => {
      if(Math.random() > 0.5) createCracker();
    }, 800);
  } else if (!isCrackersActive && crackerInterval) {
    clearInterval(crackerInterval);
    crackerInterval = null;
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reset cursor position
  mouseX = window.innerWidth / 2;
  mouseY = window.innerHeight / 2;
  
  // Update stars for new screen size
  starsContainer.innerHTML = '';
  createStars();
});

// Touch support for mobile
let touchActive = false;
document.addEventListener('touchstart', (e) => {
  touchActive = true;
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
  
  if(startScreen.style.display !== 'none') {
    startBtn.click();
  }
  
  // Create touch fire effect
  createFireBurst(mouseX, mouseY);
});

document.addEventListener('touchmove', (e) => {
  if(!touchActive) return;
  e.preventDefault();
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
  
  // Create spark trail
  if(Math.random() > 0.8) {
    createSpark(mouseX, mouseY);
  }
});

document.addEventListener('touchend', () => {
  touchActive = false;
  cursorFire.style.opacity = '0';
});

// Auto-start on mobile after a short delay (optional)
setTimeout(() => {
  if (window.innerWidth < 768 && startScreen.style.display !== 'none') {
    startBtn.click();
  }
}, 2000);
