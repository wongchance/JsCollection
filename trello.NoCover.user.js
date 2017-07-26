// ==UserScript==
// @name         trello no cover
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       wongchance
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/trello.NoCover.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/trello.NoCover.user.js
// @match        https://trello.com/b/LvwOjrYP/ingress-medal-arts
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    jQuery(document).ready(function() {
        setInterval(function() {
            RemoveCover();
        }, 50);
    });

    function RemoveCover() {
        $('div.list-card-cover.js-card-cover').remove();
        $('div.header-banner.mod-warning').remove();
        $('div.member').remove();
        //$('div.board-menu-container').html('');
        //$('a.board-menu-header-close-button.icon-lg icon-close.js-hide-sidebar').click();
    }
})();