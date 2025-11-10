// ===== ANSES - SITIO ACCESIBLE =====
// Script principal con todas las funcionalidades accesibles

class ANSESAccessible {
    constructor() {
        this.currentCarouselSlide = 0;
        this.carouselInterval = null;
        this.isAutoPlay = true;
        this.init();
    }

    init() {
        this.setupAccessibility();
        this.setupCarousel();
        this.setupNavigation();
        this.setupCUILForm();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.announcePageLoad();
    }

    // ===== CONFIGURACIÓN DE ACCESIBILIDAD =====
    setupAccessibility() {
        // Cargar preferencias guardadas
        this.loadAccessibilityPreferences();
        
        // Configurar botones de accesibilidad
        this.setupAccessibilityButtons();
        
        // Mejorar focus para elementos personalizados
        this.enhanceFocusManagement();
        
        // Configurar live regions para anuncios
        this.setupLiveRegions();
    }

    loadAccessibilityPreferences() {
        // Alto contraste
        if (localStorage.getItem('anses-highContrast') === 'true') {
            document.body.classList.add('high-contrast');
            this.updateHighContrastButton(true);
        }

        // Texto grande
        if (localStorage.getItem('anses-largeText') === 'true') {
            document.body.classList.add('large-text');
            this.updateFontSizeButton(true);
        }
    }

    setupAccessibilityButtons() {
        const highContrastBtn = document.getElementById('high-contrast-btn');
        const fontSizeBtn = document.getElementById('font-size-btn');

        if (highContrastBtn) {
            highContrastBtn.addEventListener('click', () => this.toggleHighContrast());
            highContrastBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleHighContrast();
                }
            });
        }

        if (fontSizeBtn) {
            fontSizeBtn.addEventListener('click', () => this.toggleFontSize());
            fontSizeBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFontSize();
                }
            });
        }
    }

    toggleHighContrast() {
        const isActive = document.body.classList.toggle('high-contrast');
        this.updateHighContrastButton(isActive);
        localStorage.setItem('anses-highContrast', isActive);
        this.announceToScreenReader(isActive ? 
            'Modo alto contraste activado' : 'Modo alto contraste desactivado');
    }

    updateHighContrastButton(isActive) {
        const btn = document.getElementById('high-contrast-btn');
        if (btn) {
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            
            if (isActive) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Contraste Normal';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                icon.className = 'fas fa-adjust';
                text.textContent = 'Alto Contraste';
                btn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    toggleFontSize() {
        const isActive = document.body.classList.toggle('large-text');
        this.updateFontSizeButton(isActive);
        localStorage.setItem('anses-largeText', isActive);
        this.announceToScreenReader(isActive ? 
            'Tamaño de texto grande activado' : 'Tamaño de texto normal activado');
    }

    updateFontSizeButton(isActive) {
        const btn = document.getElementById('font-size-btn');
        if (btn) {
            const text = btn.querySelector('span');
            
            if (isActive) {
                text.textContent = 'A-';
                btn.setAttribute('aria-pressed', 'true');
            } else {
                text.textContent = 'A+';
                btn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    enhanceFocusManagement() {
        // Hacer las tarjetas de servicio focusables
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = card.querySelector('.service-link');
                    if (link) {
                        link.click();
                    }
                }
            });
        });

        // Mejorar focus en dropdowns
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(toggle);
                } else if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdown(toggle);
                }
            });
        });
    }

    setupLiveRegions() {
        // Crear región live para anuncios
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.classList.add('sr-only');
        liveRegion.id = 'live-announcements';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Limpiar después de un tiempo
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 3000);
        }
    }

    // ===== CARRUSEL INTERACTIVO =====
    setupCarousel() {
        this.carouselSlides = document.querySelectorAll('.carousel-slide');
        this.carouselIndicators = document.querySelectorAll('.indicator');
        this.carouselPrev = document.querySelector('.carousel-control.prev');
        this.carouselNext = document.querySelector('.carousel-control.next');

        if (this.carouselSlides.length === 0) return;

        this.setupCarouselEvents();
        this.startAutoPlay();
        this.updateCarouselAccessibility();
    }

    setupCarouselEvents() {
        // Botones anterior/siguiente
        if (this.carouselPrev) {
            this.carouselPrev.addEventListener('click', () => {
                this.previousSlide();
                this.resetAutoPlay();
            });
            
            this.carouselPrev.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.previousSlide();
                    this.resetAutoPlay();
                }
            });
        }

        if (this.carouselNext) {
            this.carouselNext.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
            
            this.carouselNext.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoPlay();
                }
            });
        }

        // Indicadores
        this.carouselIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
            
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                    this.resetAutoPlay();
                }
            });
        });

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.hero-carousel')) {
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
                        this.goToSlide(this.carouselSlides.length - 1);
                        this.resetAutoPlay();
                        break;
                }
            }
        });

        // Pausar en hover/focus
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
            carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
            carousel.addEventListener('focusin', () => this.pauseAutoPlay());
            carousel.addEventListener('focusout', () => this.resumeAutoPlay());
        }
    }

    updateCarouselAccessibility() {
        this.carouselSlides.forEach((slide, index) => {
            const isActive = index === this.currentCarouselSlide;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
            
            if (isActive) {
                slide.removeAttribute('inert');
            } else {
                slide.setAttribute('inert', '');
            }
        });

        this.carouselIndicators.forEach((indicator, index) => {
            const isActive = index === this.currentCarouselSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
            indicator.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // Anunciar cambio de slide
        const activeSlide = this.carouselSlides[this.currentCarouselSlide];
        const slideLabel = activeSlide.getAttribute('aria-label');
        if (slideLabel) {
            this.announceToScreenReader(slideLabel);
        }
    }

    nextSlide() {
        this.currentCarouselSlide = (this.currentCarouselSlide + 1) % this.carouselSlides.length;
        this.updateCarouselAccessibility();
    }

    previousSlide() {
        this.currentCarouselSlide = (this.currentCarouselSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
        this.updateCarouselAccessibility();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.carouselSlides.length) {
            this.currentCarouselSlide = index;
            this.updateCarouselAccessibility();
        }
    }

    startAutoPlay() {
        if (this.isAutoPlay) {
            this.carouselInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }

    pauseAutoPlay() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    resumeAutoPlay() {
        if (this.isAutoPlay && !this.carouselInterval) {
            this.startAutoPlay();
        }
    }

    resetAutoPlay() {
        this.pauseAutoPlay();
        this.resumeAutoPlay();
    }

    // ===== NAVEGACIÓN Y DROPDOWNS =====
    setupNavigation() {
        this.setupDropdowns();
        this.setupMobileNavigation();
    }

    setupDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(toggle);
            });

            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', () => {
                this.closeAllDropdowns();
            });

            // Prevenir que el dropdown se cierre al hacer clic dentro
            const dropdownMenu = toggle.nextElementSibling;
            if (dropdownMenu) {
                dropdownMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    }

    toggleDropdown(toggle) {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        this.closeAllDropdowns();
        
        if (!isExpanded) {
            this.openDropdown(toggle);
        }
    }

    openDropdown(toggle) {
        const dropdownMenu = toggle.nextElementSibling;
        if (dropdownMenu) {
            toggle.setAttribute('aria-expanded', 'true');
            dropdownMenu.style.display = 'block';
            
            // Focus en el primer elemento del dropdown
            const firstItem = dropdownMenu.querySelector('a');
            if (firstItem) {
                firstItem.focus();
            }
        }
    }

    closeAllDropdowns() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        
        dropdownToggles.forEach(toggle => {
            toggle.setAttribute('aria-expanded', 'false');
        });
        
        dropdownMenus.forEach(menu => {
            menu.style.display = 'none';
        });
    }

    setupMobileNavigation() {
        // En pantallas pequeñas, convertir el menú en acordeón
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        this.handleMobileNavigation(mediaQuery);
        mediaQuery.addListener(this.handleMobileNavigation);
    }

    handleMobileNavigation = (mediaQuery) => {
        const navItems = document.querySelectorAll('.nav-item.has-dropdown');
        
        if (mediaQuery.matches) {
            // Modo móvil
            navItems.forEach(item => {
                const toggle = item.querySelector('.dropdown-toggle');
                const menu = item.querySelector('.dropdown-menu');
                
                if (toggle && menu) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.style.display = 'none';
                }
            });
        } else {
            // Modo desktop - restaurar comportamiento hover
            navItems.forEach(item => {
                const menu = item.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = '';
                }
            });
            this.closeAllDropdowns();
        }
    }

    // ===== FORMULARIO CUIL =====
    setupCUILForm() {
        const cuilForm = document.getElementById('cuil-form');
        if (!cuilForm) return;

        this.setupFormValidation(cuilForm);
        this.setupRealTimePreview();
        this.setupFormSubmission(cuilForm);
    }

    setupFormValidation(form) {
        const dniInput = form.querySelector('#dni');
        const generoSelect = form.querySelector('#genero');
        const terminosCheckbox = form.querySelector('input[name="terminos"]');

        // Validación en tiempo real del DNI
        if (dniInput) {
            dniInput.addEventListener('input', (e) => {
                this.validateDNI(e.target);
                this.updateCUILPreview();
            });
        }

        // Validación del género
        if (generoSelect) {
            generoSelect.addEventListener('change', () => {
                this.updateCUILPreview();
            });
        }

        // Validación de términos
        if (terminosCheckbox) {
            terminosCheckbox.addEventListener('change', () => {
                this.validateCheckbox(terminosCheckbox);
            });
        }
    }

    validateDNI(input) {
        const value = input.value.replace(/\D/g, '');
        const helpText = input.parentElement.querySelector('.help-text');
        
        // Actualizar valor solo con números
        input.value = value;

        if (value.length === 0) {
            this.setFieldValidity(input, false, '');
        } else if (value.length < 7) {
            this.setFieldValidity(input, false, 'El DNI debe tener al menos 7 dígitos');
        } else if (value.length > 8) {
            this.setFieldValidity(input, false, 'El DNI no puede tener más de 8 dígitos');
        } else {
            this.setFieldValidity(input, true, '');
        }

        return input.validity.valid;
    }

    validateCheckbox(checkbox) {
        const isValid = checkbox.checked;
        this.setFieldValidity(checkbox, isValid, 'Debes aceptar los términos y condiciones');
        return isValid;
    }

    setFieldValidity(field, isValid, message) {
        if (isValid) {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        } else {
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('error');
        }

        // Mostrar/ocultar mensaje de error
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement && message) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    setupRealTimePreview() {
        // Actualizar fecha en la vista previa
        const fechaPreview = document.getElementById('fecha-preview');
        if (fechaPreview) {
            const now = new Date();
            fechaPreview.textContent = now.toLocaleDateString('es-AR');
        }
    }

    updateCUILPreview() {
        const dniInput = document.getElementById('dni');
        const generoSelect = document.getElementById('genero');
        
        if (!dniInput || !generoSelect) return;

        const dni = dniInput.value;
        const genero = generoSelect.value;

        if (dni.length >= 7 && genero) {
            // Simular generación de CUIL (esto es un ejemplo)
            const cuil = this.generateCUIL(dni, genero);
            
            // Actualizar vista previa (en una implementación real, esto vendría de una API)
            const cuilField = document.querySelector('.preview-field:nth-child(3) .field-value');
            if (cuilField) {
                cuilField.textContent = cuil;
                cuilField.style.color = '#28a745';
                cuilField.style.fontWeight = 'bold';
            }
        }
    }

    generateCUIL(dni, genero) {
        // Algoritmo simplificado para generar CUIL (ejemplo educativo)
        let prefix = '';
        switch(genero) {
            case 'M': prefix = '20'; break;
            case 'F': prefix = '27'; break;
            case 'X': prefix = '30'; break;
            default: prefix = '20';
        }

        const base = prefix + dni.padStart(8, '0');
        let sum = 0;
        const factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

        for (let i = 0; i < 10; i++) {
            sum += parseInt(base[i]) * factors[i];
        }

        const remainder = sum % 11;
        let verificationDigit = 11 - remainder;

        if (verificationDigit === 11) verificationDigit = 0;
        if (verificationDigit === 10) verificationDigit = 9;

        return base + '-' + verificationDigit;
    }

    setupFormSubmission(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.submitCUILForm(form);
            }
        });
    }

    validateForm(form) {
        const dniInput = form.querySelector('#dni');
        const generoSelect = form.querySelector('#genero');
        const terminosCheckbox = form.querySelector('input[name="terminos"]');

        const isDNIValid = this.validateDNI(dniInput);
        const isGeneroValid = generoSelect.value !== '';
        const isTerminosValid = this.validateCheckbox(terminosCheckbox);

        if (!isGeneroValid) {
            this.setFieldValidity(generoSelect, false, 'Selecciona tu género');
            generoSelect.focus();
        }

        return isDNIValid && isGeneroValid && isTerminosValid;
    }

    submitCUILForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Simular envío
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Simular respuesta exitosa
            this.showSuccessMessage();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // En una implementación real, aquí se descargaría el PDF
            this.simulatePDFDownload();
        }, 2000);
    }

    showSuccessMessage() {
        this.announceToScreenReader('Constancia de CUIL generada exitosamente. La descarga comenzará automáticamente.');
        
        // Mostrar mensaje visual
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <h4>¡Constancia generada exitosamente!</h4>
                    <p>Tu constancia de CUIL se está descargando.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 5000);
    }

    simulatePDFDownload() {
        // En una implementación real, esto descargaría un PDF real
        console.log('Descargando constancia de CUIL...');
        
        // Simular descarga
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'constancia-cuil.pdf';
        link.click();
    }

    // ===== EVENT LISTENERS GLOBALES =====
    setupEventListeners() {
        // Mejorar experiencia de formularios
        this.enhanceFormExperiences();
        
        // Configurar búsqueda
        this.setupSearch();
        
        // Manejar errores de carga de imágenes
        this.handleImageErrors();
    }

    enhanceFormExperiences() {
        // Auto-focus en primer campo de formulario
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const firstInput = form.querySelector('input, select, textarea');
            if (firstInput && !firstInput.disabled) {
                form.addEventListener('focusin', () => {
                    if (!firstInput.matches(':focus')) {
                        firstInput.focus();
                    }
                });
            }
        });
    }

    setupSearch() {
        const searchForm = document.querySelector('.search-box form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = searchForm.querySelector('input');
                if (input.value.trim()) {
                    this.performSearch(input.value.trim());
                }
            });
        }
    }

    performSearch(query) {
        // Simular búsqueda
        this.announceToScreenReader(`Buscando: ${query}. Mostrando resultados...`);
        console.log('Buscando:', query);
        
        // En una implementación real, aquí iría la lógica de búsqueda
    }

    handleImageErrors() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                const alt = img.getAttribute('alt') || 'Imagen';
                img.outerHTML = `<div class="image-placeholder" role="img" aria-label="${alt} no disponible">
                    <i class="fas fa-image"></i>
                    <span>${alt}</span>
                </div>`;
            });
        });
    }

    // ===== NAVEGACIÓN POR TECLADO =====
    setupKeyboardNavigation() {
        // Atajos de teclado globales
        document.addEventListener('keydown', (e) => {
            // Skip to main content (tecla S)
            if (e.key === 's' || e.key === 'S') {
                const skipLink = document.querySelector('.skip-link');
                if (skipLink) {
                    e.preventDefault();
                    skipLink.focus();
                }
            }
            
            // Navegación por headings (tecla H)
            if (e.key === 'h' || e.key === 'H') {
                this.navigateHeadings(e.shiftKey);
            }
        });

        // Trap focus en modales (si los hubiera)
        this.setupFocusTrapping();
    }

    navigateHeadings(backwards = false) {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const currentIndex = headings.findIndex(h => h === document.activeElement);
        
        let nextIndex;
        if (backwards) {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : headings.length - 1;
        } else {
            nextIndex = currentIndex < headings.length - 1 ? currentIndex + 1 : 0;
        }
        
        if (headings[nextIndex]) {
            headings[nextIndex].setAttribute('tabindex', '-1');
            headings[nextIndex].focus();
            this.announceToScreenReader(`Encabezado: ${headings[nextIndex].textContent}`);
        }
    }

    setupFocusTrapping() {
        // En una implementación real, esto atraparía el focus en modales
        console.log('Focus trapping configurado');
    }

    // ===== INICIALIZACIÓN Y UTILIDADES =====
    announcePageLoad() {
        // Esperar a que la página esté completamente cargada
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.announceToScreenReader('Página de ANSES completamente cargada. Use la tecla S para saltar al contenido principal.');
            });
        } else {
            this.announceToScreenReader('Página de ANSES completamente cargada. Use la tecla S para saltar al contenido principal.');
        }
    }

    // Utilidad para formatear números
    formatNumber(number) {
        return new Intl.NumberFormat('es-AR').format(number);
    }

    // Utilidad para fechas
    formatDate(date) {
        return new Intl.DateTimeFormat('es-AR').format(date);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    const ansesApp = new ANSESAccessible();
    
    // Hacer disponible globalmente para debugging
    window.ansesApp = ansesApp;
    
    // Configurar Service Worker (si está disponible)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registrado'))
            .catch(err => console.log('Service Worker no registrado:', err));
    }
});

// ===== POLYFILLS PARA ACCESIBILIDAD =====
// Polyfill para inert (si el navegador no lo soporta)
if (!HTMLElement.prototype.hasOwnProperty('inert')) {
    Object.defineProperty(HTMLElement.prototype, 'inert', {
        get: function() {
            return this.hasAttribute('inert');
        },
        set: function(value) {
            if (value) {
                this.setAttribute('inert', '');
                this.setAttribute('aria-hidden', 'true');
                this.style.pointerEvents = 'none';
                this.style.userSelect = 'none';
            } else {
                this.removeAttribute('inert');
                this.removeAttribute('aria-hidden');
                this.style.pointerEvents = '';
                this.style.userSelect = '';
            }
        }
    });
}

// Polyfill para focus-visible
(function() {
    const className = 'focus-visible';
    const lastMouseClickTime = 0;
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    function handleKeyDown() {
        document.body.classList.add(className);
    }
    
    function handleMouseDown() {
        document.body.classList.remove(className);
    }
})();

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (event) => {
    console.error('Error capturado:', event.error);
    // En producción, aquí se reportaría el error a un servicio de monitoreo
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada:', event.reason);
    // En producción, aquí se reportaría el error a un servicio de monitoreo
});

// ===== PERFORMANCE Y OFFLINE =====
// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        // Agregar recursos críticos aquí
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Lazy loading para imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
