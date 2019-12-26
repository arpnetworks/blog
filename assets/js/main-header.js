(function ($) {
  const menuBtn = $('.main-header__menu-button');
  const body = $('body');

  function toggleMenu() {
    body.toggleClass('menu_opened');
    menuBtn.toggleClass('main-header__menu-button_opened');
  }

  menuBtn.on('click', function () {
    toggleMenu();
  });

  $('.initial-content').on('click', function () {
    if (body.hasClass('menu_opened')) {
      toggleMenu();
    }
  })
})(jQuery);
