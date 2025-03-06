let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.style.top = '-70px'; // Ocultar header
    } else {
        header.style.top = '0'; // Mostrar header
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Evitar valores negativos
});
