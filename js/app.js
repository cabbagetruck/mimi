// ===== Page & Animation Controller =====
// (scenes & registerScene are defined in pixel-engine.js, loaded first)

let currentPage = 1;
let typingTimer = null;

// Typing animation
function startTyping(pageEl, onComplete) {
  const textEl = pageEl.querySelector('.typing-text');
  const fullText = textEl.dataset.text;
  textEl.textContent = '';
  textEl.classList.remove('done');

  let i = 0;
  typingTimer = setInterval(() => {
    textEl.textContent += fullText[i];
    i++;
    if (i >= fullText.length) {
      clearInterval(typingTimer);
      typingTimer = null;
      textEl.classList.add('done');
      if (onComplete) onComplete();
    }
  }, 100);
}

// Show the next button after typing completes
function showButton(pageEl) {
  const btn = pageEl.querySelector('.next-btn');
  if (btn) {
    btn.classList.add('visible');
  }
}

// Navigate to a page
function goToPage(num) {
  // Stop current scene
  if (scenes[currentPage] && scenes[currentPage].stop) {
    scenes[currentPage].stop();
  }
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }

  // Hide current
  const currentEl = document.getElementById(`page-${currentPage}`);
  currentEl.classList.remove('active');

  // Reset button visibility
  const prevBtn = currentEl.querySelector('.next-btn');
  if (prevBtn) prevBtn.classList.remove('visible');

  // Show next
  currentPage = num;
  const nextEl = document.getElementById(`page-${currentPage}`);
  nextEl.classList.add('active');

  // Start scene animation
  if (scenes[currentPage] && scenes[currentPage].start) {
    scenes[currentPage].start();
  }

  // Start typing after a short delay
  setTimeout(() => {
    startTyping(nextEl, () => {
      showButton(nextEl);
    });
  }, 500);
}

// Initialize all canvases and scenes
function initApp() {
  // Init each registered scene
  for (const [pageNum, scene] of Object.entries(scenes)) {
    scene.init();
  }

  // Bind next buttons
  document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextPage = parseInt(btn.dataset.next);
      goToPage(nextPage);
    });
  });

  // Start page 1
  const page1 = document.getElementById('page-1');
  if (scenes[1] && scenes[1].start) {
    scenes[1].start();
  }
  setTimeout(() => {
    startTyping(page1, () => {
      showButton(page1);
    });
  }, 500);
}

// Boot
document.addEventListener('DOMContentLoaded', initApp);
