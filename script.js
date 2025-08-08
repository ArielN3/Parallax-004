// Variáveis globais
let scrollY = 0;
let ticking = false;

// Elementos do DOM
const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');
const layer3 = document.getElementById('layer3');
const layer4 = document.getElementById('layer4');
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Função para atualizar o parallax
function updateParallax() {
    // Velocidades diferentes para cada camada
    const speed1 = scrollY * 0.1;  // Mais lenta (fundo)
    const speed2 = scrollY * 0.4;  // Média lenta
    const speed3 = scrollY * 0.9;  // Média rápida
    const speed4 = scrollY * 0.6;  // Mais rápida (frente)
    
    // Aplicar transformações nas camadas
    layer1.style.transform = `translateY(${speed1}px)`;
    layer2.style.transform = `translateY(${speed2}px)`;
    layer3.style.transform = `translateY(${speed3}px)`;
    layer4.style.transform = `translateY(${speed4}px)`;
    
    // Efeito no texto do hero
    const titleSpeed = scrollY * 0.2;
    const subtitleSpeed = scrollY * 0.15;
    const indicatorSpeed = scrollY * 0.1;
    
    heroTitle.style.transform = `translateY(${titleSpeed}px)`;
    heroSubtitle.style.transform = `translateY(${subtitleSpeed}px)`;
    scrollIndicator.style.transform = `translateY(${indicatorSpeed}px)`;
    
    // Fade out do conteúdo do hero
    const titleOpacity = Math.max(0, 1 - scrollY / 500);
    const subtitleOpacity = Math.max(0, 1 - scrollY / 600);
    const indicatorOpacity = Math.max(0, 1 - scrollY / 400);
    
    heroTitle.style.opacity = titleOpacity;
    heroSubtitle.style.opacity = subtitleOpacity;
    scrollIndicator.style.opacity = indicatorOpacity;
    
    ticking = false;
}

// Função de throttle para otimizar performance
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Event listener para scroll
function handleScroll() {
    scrollY = window.pageYOffset;
    requestTick();
}

// Event listener para resize (recalcular se necessário)
function handleResize() {
    // Recalcular posições se necessário
    scrollY = window.pageYOffset;
    requestTick();
}

// Inicialização
function init() {
    // Adicionar event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Configuração inicial
    updateParallax();
    
    // Smooth scroll para links internos (se houver)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Aguardar o DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Função para detectar se o usuário prefere movimento reduzido
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Desabilitar parallax se o usuário preferir movimento reduzido
if (respectsReducedMotion()) {
    // Remover transformações se o usuário preferir movimento reduzido
    const style = document.createElement('style');
    style.textContent = `
        .parallax-layer,
        .hero-content * {
            transform: none !important;
        }
        .scroll-indicator {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Função para otimizar performance em dispositivos móveis
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar performance para mobile
if (isMobile()) {
    // Reduzir a frequência de atualização em dispositivos móveis
    let mobileTimeout;
    const originalHandleScroll = handleScroll;
    
    handleScroll = function() {
        clearTimeout(mobileTimeout);
        mobileTimeout = setTimeout(originalHandleScroll, 16); // ~60fps
    };
}

