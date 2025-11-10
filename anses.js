// JavaScript para mejorar la accesibilidad del sitio ANSES
document.addEventListener('DOMContentLoaded', function() {
    // Manejo de submenús accesibles
    const menuButtons = document.querySelectorAll('.menu-item-has-children button');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            const submenu = this.nextElementSibling;
            if (submenu) {
                submenu.style.display = expanded ? 'none' : 'block';
            }
        });

        // Cerrar submenús al presionar Escape
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.setAttribute('aria-expanded', 'false');
                const submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.style.display = 'none';
                }
                this.focus();
            }
        });
    });

    // Funcionalidad del carrusel
    class CarouselAccesible {
        constructor(container) {
            this.container = container;
            this.track = container.querySelector('.carousel-track');
            this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
            this.indicators = Array.from(container.querySelectorAll('.indicator'));
            this.prevBtn = container.querySelector('.carousel-prev');
            this.nextBtn = container.querySelector('.carousel-next');
            this.currentIndex = 0;
            
            this.init();
        }
        
        init() {
            this.updateSlideVisibility();
            this.addEventListeners();
            this.startAutoPlay();
        }
        
        addEventListeners() {
            // Botones anterior/siguiente
            this.prevBtn.addEventListener('click', () => {
                this.previousSlide();
                this.resetAutoPlay();
            });
            
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
            
            // Indicadores
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                });
            });
            
            // Navegación por teclado
            this.container.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        this.resetAutoPlay();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        this.resetAutoPlay();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        this.resetAutoPlay();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.slides.length - 1);
                        this.resetAutoPlay();
                        break;
                }
            });
            
            // Pausar carrusel al hacer hover o focus
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
            this.container.addEventListener('focusin', () => this.pauseAutoPlay());
            this.container.addEventListener('focusout', () => this.resumeAutoPlay());
        }
        
        updateSlideVisibility() {
            this.slides.forEach((slide, index) => {
                const isActive = index === this.currentIndex;
                slide.classList.toggle('active', isActive);
                slide.style.display = isActive ? 'flex' : 'none';
                
                // Actualizar ARIA labels
                slide.setAttribute('aria-label', `Slide ${index + 1} de ${this.slides.length}`);
            });
            
            this.indicators.forEach((indicator, index) => {
                const isActive = index === this.currentIndex;
                indicator.classList.toggle('active', isActive);
                indicator.setAttribute('aria-selected', isActive);
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            });
        }
        
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.updateSlideVisibility();
        }
        
        previousSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.updateSlideVisibility();
        }
        
        goToSlide(index) {
            this.currentIndex = index;
            this.updateSlideVisibility();
        }
        
        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
        
        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
        
        resumeAutoPlay() {
            if (!this.autoPlayInterval) {
                this.startAutoPlay();
            }
        }
        
        resetAutoPlay() {
            this.pauseAutoPlay();
            this.resumeAutoPlay();
        }
    }
    
    // Inicializar carruseles
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => new CarouselAccesible(container));
    
    // Validación de formulario
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');
            
            // Validación simple de email
            if (emailInput && !isValidEmail(emailInput.value)) {
                emailError.textContent = 'Por favor, ingrese un correo electrónico válido';
                emailInput.setAttribute('aria-invalid', 'true');
                isValid = false;
            } else {
                emailError.textContent = '';
                emailInput.setAttribute('aria-invalid', 'false');
            }
            
            if (isValid) {
                // Simular envío exitoso
                alert('Consulta enviada correctamente. Nos pondremos en contacto a la brevedad.');
                this.reset();
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Funcionalidad de accesibilidad
    const highContrastBtn = document.getElementById('high-contrast-btn');
    const fontSizeBtn = document.getElementById('font-size-btn');
    
    // Alto contraste
    highContrastBtn.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        this.setAttribute('aria-pressed', isActive);
        this.textContent = isActive ? 'Contraste Normal' : 'Alto Contraste';
        
        // Guardar preferencia
        localStorage.setItem('highContrast', isActive);
    });
    
    // Tamaño de fuente
    fontSizeBtn.addEventListener('click', function() {
        document.body.classList.toggle('large-text');
        const isActive = document.body.classList.contains('large-text');
        this.setAttribute('aria-pressed', isActive);
        this.textContent = isActive ? 'A-' : 'A+';
        
        // Guardar preferencia
        localStorage.setItem('largeText', isActive);
    });
    
    // Cargar preferencias guardadas
    if (localStorage.getItem('highContrast') === 'true') {
        document.body.classList.add('high-contrast');
        highContrastBtn.setAttribute('aria-pressed', 'true');
        highContrastBtn.textContent = 'Contraste Normal';
    }
    
    if (localStorage.getItem('largeText') === 'true') {
        document.body.classList.add('large-text');
        fontSizeBtn.setAttribute('aria-pressed', 'true');
        fontSizeBtn.textContent = 'A-';
    }
    
    // Mejorar navegación por teclado en tarjetas
    const cards = document.querySelectorAll('.quick-access-card, .news-card');
    cards.forEach(card => {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
        
        // Hacer las tarjetas focusables
        card.setAttribute('tabindex', '0');
    });
    
    // Anunciar cambios dinámicos para lectores de pantalla
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Mejorar la experiencia de carga
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        announceToScreenReader('Página completamente cargada');
    });
});
