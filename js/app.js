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

// Show nav buttons after typing completes
function showButtons(pageEl) {
  pageEl.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.add('visible');
  });
}

// Hide nav buttons
function hideButtons(pageEl) {
  pageEl.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('visible');
  });
}

// Navigate to a page
function goToPage(num) {
  if (num < 1 || num > 4) return;

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
  hideButtons(currentEl);

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
      showButtons(nextEl);
    });
  }, 500);
}

// Initialize all canvases and scenes
function initApp() {
  // Init each registered scene
  for (const [pageNum, scene] of Object.entries(scenes)) {
    scene.init();
  }

  // Bind all nav buttons (prev and next)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.go);
      goToPage(target);
    });
  });

  // Start page 1
  const page1 = document.getElementById('page-1');
  if (scenes[1] && scenes[1].start) {
    scenes[1].start();
  }
  setTimeout(() => {
    startTyping(page1, () => {
      showButtons(page1);
    });
  }, 500);
}

// Boot
document.addEventListener('DOMContentLoaded', initApp);
