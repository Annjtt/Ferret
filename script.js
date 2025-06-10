document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initHeader();
    initMobileMenu();
    initSliders();
    initFormValidation();
    initBudgetSlider();
    initScrollToTop();
    initModalHandlers();
    initAnimations();
});

/**
 * Инициализация шапки сайта
 * Добавляет класс при скролле
 */
function initHeader() {
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });

    // Плавный скролл при клике на навигационные ссылки
    const navLinks = document.querySelectorAll('.nav__link, .footer__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Закрыть мобильное меню, если оно открыто
                    closeMobileMenu();
                }
            }
        });
    });
}

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    // Создаем мобильное меню и оверлей, если их еще нет в DOM
    if (!document.querySelector('.mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <button class="mobile-menu__close" aria-label="Закрыть меню">
                <i class="fas fa-times"></i>
            </button>
            <nav class="mobile-menu__nav">
                <ul class="mobile-menu__list">
                    <li class="mobile-menu__item"><a href="#" class="mobile-menu__link">Главная</a></li>
                    <li class="mobile-menu__item"><a href="#how-it-works" class="mobile-menu__link">Как это работает</a></li>
                    <li class="mobile-menu__item"><a href="#examples" class="mobile-menu__link">Примеры</a></li>
                    <li class="mobile-menu__item"><a href="#services" class="mobile-menu__link">Услуги</a></li>
                    <li class="mobile-menu__item"><a href="#reviews" class="mobile-menu__link">Отзывы</a></li>
                    <li class="mobile-menu__item"><a href="#contacts" class="mobile-menu__link">Контакты</a></li>
                </ul>
            </nav>
            <button class="btn btn--primary mobile-menu__btn">Заказать подарок</button>
        `;
        document.body.appendChild(mobileMenu);

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
    }

    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu__close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const mobileMenuBtn = document.querySelector('.mobile-menu__btn');

    // Открытие мобильного меню
    burger.addEventListener('click', function() {
        openMobileMenu();
    });

    // Закрытие мобильного меню при клике на крестик
    mobileMenuClose.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Закрытие мобильного меню при клике на оверлей
    overlay.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Закрытие мобильного меню при клике на ссылку
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Открытие формы заказа при клике на кнопку в мобильном меню
    mobileMenuBtn.addEventListener('click', function() {
        closeMobileMenu();
        scrollToSection('#order');
    });

    // Кнопка "Заказать подарок" в шапке
    const headerBtn = document.querySelector('.header__btn');
    headerBtn.addEventListener('click', function() {
        scrollToSection('#order');
    });

    // Кнопка "Начать подбор" в hero-секции
    const heroBtn = document.querySelector('.hero__btn');
    heroBtn.addEventListener('click', function() {
        scrollToSection('#order');
    });
}

/**
 * Открытие мобильного меню
 */
function openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    body.style.overflow = 'hidden'; // Запрет прокрутки страницы
}

/**
 * Закрытие мобильного меню
 */
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.overlay');
    const body = document.body;

    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    body.style.overflow = ''; // Разрешение прокрутки страницы
}

/**
 * Плавный скролл к секции
 */
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Инициализация слайдеров
 */
function initSliders() {
    // Слайдер примеров подарков
    initExamplesSlider();
    
    // Слайдер отзывов
    initReviewsSlider();
}

/**
 * Инициализация слайдера примеров подарков
 */
function initExamplesSlider() {
    const slider = document.querySelector('.examples__slider');
    const slides = document.querySelectorAll('.example');
    const prevBtn = document.querySelector('.examples .slider-control--prev');
    const nextBtn = document.querySelector('.examples .slider-control--next');
    const dots = document.querySelectorAll('.examples .slider-dot');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const slideWidth = slides[0].offsetWidth;
    const slideMargin = parseInt(window.getComputedStyle(slides[0]).marginRight);
    const slidesToShow = getSlideToShow();
    
    // Функция для определения количества отображаемых слайдов в зависимости от ширины экрана
    function getSlideToShow() {
        if (window.innerWidth < 768) {
            return 1;
        } else if (window.innerWidth < 992) {
            return 2;
        } else {
            return 3;
        }
    }
    
    // Обновление слайдера при изменении размера окна
    window.addEventListener('resize', function() {
        const newSlidesToShow = getSlideToShow();
        if (newSlidesToShow !== slidesToShow) {
            // Перезагрузка слайдера
            location.reload();
        }
    });
    
    // Функция для перехода к определенному слайду
    function goToSlide(slideIndex) {
        if (slideIndex < 0) {
            slideIndex = slides.length - slidesToShow;
        } else if (slideIndex > slides.length - slidesToShow) {
            slideIndex = 0;
        }
        
        currentSlide = slideIndex;
        
        // Обновление активной точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('slider-dot--active', index === currentSlide);
        });
        
        // Прокрутка слайдера
        slider.style.transform = `translateX(-${currentSlide * (slideWidth + slideMargin)}px)`;
    }
    
    // Обработчики событий для кнопок
    prevBtn.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
    });
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Инициализация слайдера
    slider.style.transition = 'transform 0.5s ease';
    goToSlide(0);
}

/**
 * Инициализация слайдера отзывов
 */
function initReviewsSlider() {
    const slider = document.querySelector('.reviews__slider');
    const slides = document.querySelectorAll('.review');
    const prevBtn = document.querySelector('.reviews .slider-control--prev');
    const nextBtn = document.querySelector('.reviews .slider-control--next');
    const dots = document.querySelectorAll('.reviews .slider-dot');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const slideWidth = slides[0].offsetWidth;
    const slideMargin = parseInt(window.getComputedStyle(slides[0]).marginRight);
    const slidesToShow = getSlideToShow();
    
    // Функция для определения количества отображаемых слайдов в зависимости от ширины экрана
    function getSlideToShow() {
        if (window.innerWidth < 768) {
            return 1;
        } else if (window.innerWidth < 992) {
            return 2;
        } else {
            return 3;
        }
    }
    
    // Обновление слайдера при изменении размера окна
    window.addEventListener('resize', function() {
        const newSlidesToShow = getSlideToShow();
        if (newSlidesToShow !== slidesToShow) {
            // Перезагрузка слайдера
            location.reload();
        }
    });
    
    // Функция для перехода к определенному слайду
    function goToSlide(slideIndex) {
        if (slideIndex < 0) {
            slideIndex = slides.length - slidesToShow;
        } else if (slideIndex > slides.length - slidesToShow) {
            slideIndex = 0;
        }
        
        currentSlide = slideIndex;
        
        // Обновление активной точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('slider-dot--active', index === currentSlide);
        });
        
        // Прокрутка слайдера
        slider.style.transform = `translateX(-${currentSlide * (slideWidth + slideMargin)}px)`;
    }
    
    // Обработчики событий для кнопок
    prevBtn.addEventListener('click', function() {
        goToSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        goToSlide(currentSlide + 1);
    });
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Инициализация слайдера
    slider.style.transition = 'transform 0.5s ease';
    goToSlide(0);
}

/**
 * Инициализация валидации формы
 */
function initFormValidation() {
    const orderForm = document.getElementById('orderForm');
    const successModal = document.getElementById('successModal');
    
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка валидности формы
        if (validateForm(orderForm)) {
            // Имитация отправки формы
            setTimeout(function() {
                // Очистка формы
                orderForm.reset();
                
                // Показ модального окна успешной отправки
                showModal(successModal);
            }, 1000);
        }
    });
}

/**
 * Валидация формы
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Удаление предыдущих сообщений об ошибках
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => message.remove());
    
    // Проверка обязательных полей
    requiredFields.forEach(field => {
        field.classList.remove('error');
        
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Добавление сообщения об ошибке
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Это поле обязательно для заполнения';
            field.parentNode.appendChild(errorMessage);
        }
    });
    
    // Проверка email
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            isValid = false;
            emailField.classList.add('error');
            
            // Добавление сообщения об ошибке
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Пожалуйста, введите корректный email';
            emailField.parentNode.appendChild(errorMessage);
        }
    }
    
    return isValid;
}

/**
 * Инициализация слайдера бюджета
 */
function initBudgetSlider() {
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.querySelector('.budget-value');
    
    if (!budgetSlider || !budgetValue) return;
    
    // Обновление значения при изменении слайдера
    function updateBudgetValue() {
        const value = budgetSlider.value;
        budgetValue.textContent = `${Number(value).toLocaleString('ru-RU')} ₽`;
    }
    
    // Инициализация значения
    updateBudgetValue();
    
    // Обработчик события изменения слайдера
    budgetSlider.addEventListener('input', updateBudgetValue);
}

/**
 * Инициализация кнопки "Наверх"
 */
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (!scrollTopBtn) return;
    
    // Показ/скрытие кнопки при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Скролл наверх при клике на кнопку
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Инициализация обработчиков модальных окон
 */
function initModalHandlers() {
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal__close, .modal__btn');
    
    // Закрытие модального окна при клике на крестик или кнопку
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });
    
    // Закрытие модального окна при клике на оверлей
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this);
            }
        });
    });
    
    // Закрытие модального окна при нажатии на Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                hideModal(activeModal);
            }
        }
    });
}

/**
 * Показ модального окна
 */
function showModal(modal) {
    if (!modal) return;
    
    // Запрет прокрутки страницы
    document.body.style.overflow = 'hidden';
    
    // Показ модального окна
    modal.classList.add('active');
}

/**
 * Скрытие модального окна
 */
function hideModal(modal) {
    if (!modal) return;
    
    // Разрешение прокрутки страницы
    document.body.style.overflow = '';
    
    // Скрытие модального окна
    modal.classList.remove('active');
}

/**
 * Инициализация анимаций
 */
function initAnimations() {
    // Анимация появления элементов при скролле
    const animatedElements = document.querySelectorAll('.step, .category, .example, .review');
    
    // Функция для проверки, находится ли элемент в видимой области
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    // Функция для анимации элементов
    function animateElements() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Инициализация стилей для анимации
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Запуск анимации при загрузке страницы и при скролле
    animateElements();
    window.addEventListener('scroll', animateElements);
}