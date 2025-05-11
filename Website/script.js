import * as menu from './menu.js';
import * as account from './accountInfo.js';

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScroll = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const section1 = document.getElementById('section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const footer = document.querySelector('.footer');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies to improve user experience <button class="btn cookie" id="cookie" style="background-color: lightgreen; border: none; padding: 0.6rem; border-radius: 1rem;"> Got it! </button>';

footer.after(message);

// Delete elements

document.querySelector('.cookie').addEventListener('click', function () {
  //   message.remove();
  message.parentElement.removeChild(message);
});

//

//////////////////////////////////////////////////////////
// Imlementing scroll functionality
btnScroll.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Actve tab
  clicked.classList.add('operations__tab--active');

  // Active Content
  document
    .querySelector(`.operations__content--${clicked.dataset['tab']}`)
    .classList.add('operations__content--active');
});

// Menu Fadding animation

const handleHover = function (e) {
  // console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');
    // console.log(logo);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
    // link.style.opacity = 1;
  }
};

// Passing "argument" into handle
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  // rootMargin: '-100px',
});
// allSections.forEach()
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////
// Lazy loading images

const lazyImages = document.querySelectorAll('img[data-src]');
// console.log(lazyImages);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.isIntersecting);
  // console.log(entry.target);
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.8,
});

lazyImages.forEach(image => imageObserver.observe(image));

/////////////////////////////////////////////////////////////
// Slider Component

const sliderComponent = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const slider = document.querySelector('.slider');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // const dots = document.querySelectorAll('.dots__dot');

  const gotoSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
      // moveDots(i);
    });
  };

  const addActive = function (i) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelectorAll('.dots__dot')
      [i].classList.add('dots__dot--active');
  };

  const init = function () {
    createDots();
    gotoSlide(0);
    addActive(0);
  };
  init();

  // Next Slide
  const nextSlide = function () {
    currentSlide++;
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    }
    gotoSlide(currentSlide);
    addActive(currentSlide);
  };

  // Previous Slide
  const preSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    gotoSlide(currentSlide);
    addActive(currentSlide);
  };

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', preSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e.key);
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && preSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    currentSlide = e.target.dataset.slide;
    addActive(currentSlide);
    gotoSlide(currentSlide);
  });
};

sliderComponent();
