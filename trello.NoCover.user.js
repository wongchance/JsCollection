// ==UserScript==
// @name         trllo no cover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/trello.NoCover.user.js
// @updateURL	 https://github.com/wongchance/JsCollection/raw/master/trello.NoCover.user.js
// @match        https://trello.com/b/LvwOjrYP/ingress-medal-arts
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    jQuery(document).ready(function() {
        setInterval(function() {
            RemoveCover();
        }, 100);

    });

    function RemoveCover() {
        $('div.list-card-cover.js-card-cover').css('background-image', '').css('height', '0px');
    }
})();