$(document).ready(function(){
    //мобильное меню
    var btn_menu = $('.main-nav__toggle');
    var main_nav = $('.main-nav');
    btn_menu.click(function (e) {
        e.preventDefault();
        main_nav.slideToggle("slow");
    })
});
