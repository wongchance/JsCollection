// ==UserScript==
// @name         IG TO SG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://www.indiegala.com/gift?gift_id=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// ==/UserScript==


var aCount = 0;
(function() {
    'use strict';
    jQuery(document).ready(function() {

        var aList = [];
        $('div.giftprof_key').find('a.game-steam-url').each(function(d, n) {
            aList.push($(n).innerTHML);
        });
        aCount = $('div.giftprof_key').find('a.game-steam-url').length;

        var divButton = document.createElement("div");
        divButton.classList.add("bh_button");
        divButton.id = "bh_OpenSg";
        divButton.style.bottom = '80px';
        divButton.style.position = 'fixed';
        divButton.style.right = '20px';
        //divButton.style.z-index=3; 
        var eleA = document.createElement("a");
        eleA.setAttribute("onclick", "return false;");
        eleA.textContent = "Search Sg";

        divButton.appendChild(eleA);
        document.body.appendChild(divButton);

        divButton.addEventListener("click", function() {
            for (var i = 0; i < aCount; i++) {
                //console.log($('div.giftprof_key').find('a.game-steam-url')[i].innerHTML);
                window.open("https://www.steamgifts.com/giveaways/entered/search?q=" + $('div.giftprof_key').find('a.game-steam-url')[i].innerHTML);
            }
        });

    });

})();