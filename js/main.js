const MENU_ACTIVE_CLASS = 'menu_enable'
const MENU_DISABLE_CLASS = 'menu_disable'
const NO_SCROLL_CLASS = 'no_scroll'
const MENU_VISIBLE_CLASS = 'menu_visible'
const MENU_HIDDEN_CLASS = 'menu_hidden'
const MENU_CLASS = 'menu'
const MENU_BUTTON_CLASS = 'menu_button'



const menuButton = document.querySelector('.'+MENU_BUTTON_CLASS);
let isMenuOpen = false;

const menu = document.querySelectorAll('.'+MENU_CLASS)[0];




menuButton.onclick = async function () {
    if (isMenuOpen) {
        menuButton.classList.add(MENU_DISABLE_CLASS);
        menuButton.classList.remove(MENU_ACTIVE_CLASS);
        DisableScroll();
        await HideMenu();
    } else{
        menuButton.classList.add(MENU_ACTIVE_CLASS);
        menuButton.classList.remove(MENU_DISABLE_CLASS);
        EnableScroll();
        ShowMenu();
    }
    isMenuOpen = !isMenuOpen
}


const EnableScroll = () => {document.body.classList.add(NO_SCROLL_CLASS);}
const DisableScroll = () => {document.body.classList.remove(NO_SCROLL_CLASS);}


const ShowMenu = () => {
    menu.classList.add(MENU_VISIBLE_CLASS);
    menu.classList.remove(MENU_HIDDEN_CLASS);
    menu.style.display = 'flex';
}
const HideMenu = async () => {
    menu.classList.add(MENU_HIDDEN_CLASS);
    menu.classList.remove(MENU_VISIBLE_CLASS);
    await delay(500);
    menu.style.display = 'none';
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});