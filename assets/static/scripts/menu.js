

var Hamburger = function () {
    var self = this;

    self.defaults = {
        state_active: 'active',
        body_state_active: 'js-menu-active'
    }

    self.sel = {
        menu: document.querySelector('#menu'),
        open: document.querySelector('.btn__menu_type_open'),
        close: document.querySelector('.btn__menu_type_close')
    }
}

var hamburger = new Hamburger();

Hamburger.prototype.destroy = function () {
    if (hamburger.sel.menu.classList.contains(hamburger.defaults.state_active)) {
        hamburger.sel.menu.classList.remove(hamburger.defaults.state_active);
    }

    if (document.body.classList.contains(hamburger.defaults.body_state_active)) {
        document.body.classList.remove(hamburger.defaults.body_state_active)
    }

    hamburger.sel.menu.removeEventListener('touchmove', hamburger.scrollOffTouchesDevaice)
}

Hamburger.prototype.getState = function () {
    if (hamburger.sel.menu.classList.contains(hamburger.defaults.state_active)) {
        return true;
    }
    else {
        return false;
    }
}

Hamburger.prototype.handler = function (e) {
    if (hamburger.getState() && e.target.tagName.toLowerCase() === 'a') {
        return hamburger.destroy();
    }
}

Hamburger.prototype.open = function () {
    document.body.classList.add(hamburger.defaults.body_state_active)
    hamburger.sel.menu.classList.add(hamburger.defaults.state_active)

    hamburger.sel.menu.addEventListener('touchmove', hamburger.scrollOffTouchesDevaice)
}

Hamburger.prototype.close = function () {
    document.body.classList.remove(hamburger.defaults.body_state_active)
    hamburger.sel.menu.classList.remove(hamburger.defaults.state_active)

    hamburger.sel.menu.removeEventListener('touchmove', hamburger.scrollOffTouchesDevaice)
}

Hamburger.prototype.scrollOffTouchesDevaice = function (e) {
    e.preventDefault();
}

Hamburger.prototype.init = function () {
    hamburger.sel.menu.addEventListener('click', hamburger.handler);

    hamburger.sel.open.addEventListener('click', hamburger.open)
    hamburger.sel.close.addEventListener('click', hamburger.close)
}

hamburger.init();