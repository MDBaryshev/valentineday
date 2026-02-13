document.addEventListener('DOMContentLoaded', () => {
    const env = document.getElementById('envelope');
    const overlay = document.getElementById('overlay');
    const resetBtn = document.getElementById('resetBtn');
    const startBtn = document.getElementById('startBtn');
    const introScreen = document.getElementById('introScreen');
    const bgContainer = document.getElementById('bgHearts');
    const letterContainer = document.getElementById('letterContainer');
    
    // Копия начальных карточек для сброса
    const initialPapers = Array.from(document.querySelectorAll('.paper'));
    let currentIndex = initialPapers.length - 1;

    // 1. Вход с экрана приветствия
    startBtn.addEventListener('click', () => {
        introScreen.classList.add('hidden');
    });

    // 2. Фоновые сердца
    setInterval(() => {
        const h = document.createElement('div'); h.className = 'bg-heart';
        h.style.width = h.style.height = (Math.random() * 15 + 10) + 'px';
        h.style.left = Math.random() * 100 + 'vw';
        bgContainer.appendChild(h);
        setTimeout(() => h.remove(), 8000);
    }, 700);

    function createBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            const h = document.createElement('div'); h.className = 'burst-heart';
            h.style.left = x + 'px'; h.style.top = y + 'px';
            h.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
            h.style.setProperty('--ty', (Math.random() - 0.5) * 400 - 100 + 'px');
            h.style.setProperty('--tr', Math.random() * 360 + 'deg');
            document.body.appendChild(h);
            setTimeout(() => h.remove(), 1000);
        }
    }

    // 3. Главный клик
    document.addEventListener('click', (e) => {
        const paper = e.target.closest('.paper');
        const isEnv = e.target.closest('#envelope');

        // Открытие конверта
        if (isEnv && env.classList.contains('close')) {
            env.classList.replace('close', 'open');
            return;
        }

        // Вылет карточек (сужен диапазон, чтобы не улетали)
        if (isEnv && env.classList.contains('open') && !paper && currentIndex >= 0) {
            const p = initialPapers[currentIndex];
            const rect = env.getBoundingClientRect();
            createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

            const total = initialPapers.length;
            const spread = 500; // Ширина веера в px
            const x = -(spread/2) + (spread / (total - 1)) * (total - 1 - currentIndex);
            const y = -250; 
            const r = x / 12;

            p.classList.add('fly');
            p.dataset.x = x; p.dataset.y = y; p.dataset.r = r;
            p.style.zIndex = 1000 + (total - currentIndex);
            
            document.body.appendChild(p);

            setTimeout(() => {
                p.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
            }, 50);
            
            currentIndex--;
            return;
        }

        // Зум
        if (paper && paper.classList.contains('fly')) {
            if (paper.classList.contains('zoom')) {
                closeZoom();
            } else {
                document.querySelectorAll('.paper.zoom').forEach(pz => pz.classList.remove('zoom'));
                paper.classList.add('zoom');
                overlay.classList.add('active');
            }
        } 
        
        if (e.target === overlay) closeZoom();
    });

    function closeZoom() {
        const zoomed = document.querySelector('.paper.zoom');
        if (zoomed) {
            zoomed.classList.remove('zoom');
            overlay.classList.remove('active');
            zoomed.style.transform = `translate(${zoomed.dataset.x}px, ${zoomed.dataset.y}px) rotate(${zoomed.dataset.r}deg)`;
        }
    }

    // 4. Сброс (возврат в исходное состояние)
    resetBtn.addEventListener('click', () => {
        introScreen.classList.remove('hidden');
        env.classList.replace('open', 'close');
        overlay.classList.remove('active');
        
        initialPapers.forEach(p => {
            p.classList.remove('fly', 'zoom');
            p.style.transform = '';
            letterContainer.appendChild(p);
        });
        currentIndex = initialPapers.length - 1;
    });
});
