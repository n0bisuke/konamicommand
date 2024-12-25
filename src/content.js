let keys = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    keys.push(e.key);
    keys = keys.slice(-10);  // 最新の10キーだけを保持

    if (keys.join(',') === konamiCode.join(',')) {
        const logo = document.querySelector('[aria-label="X"]');
        if (logo) {
            logo.style.transition = 'transform 0.5s';
            logo.style.transform = 'rotate(360deg)';
            
            setTimeout(() => {
                logo.style.transform = 'rotate(0deg)';
            }, 500);
        }
    }
});