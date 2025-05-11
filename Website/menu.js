const openMenu = document.querySelector('.toggle__menu');
const closeMenu = document.querySelector('.close-menu');
const menuLinks = document.querySelector('.nav__links');
const overlayWindow = document.querySelector('.overlay');
const nextStep = document.querySelector('.next-step');

const openModals = function () {
  openMenu.classList.add('hidden-menu');
  menuLinks.classList.remove('hidden-menu');
  closeMenu.classList.remove('hidden-menu');
  overlayWindow.classList.remove('hidden');
};
const closeModals = function () {
  openMenu.classList.remove('hidden-menu');
  menuLinks.classList.add('hidden-menu');
  closeMenu.classList.add('hidden-menu');
  overlayWindow.classList.add('hidden');
};

openMenu.addEventListener('click', openModals);
closeMenu.addEventListener('click', closeModals);
overlayWindow.addEventListener('click', closeModals);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModals();
});

nextStep.addEventListener('click', function (e) {
  const form = e.target.closest('.modal');
  form.classList.add('hidden');
  overlayWindow.classList.add('hidden');
});
