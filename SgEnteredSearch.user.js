// ==UserScript==
// @name         Sg Entered Search
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to take over the world!
// @author       wongchance
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/SgEnteredSearch.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/SgEnteredSearch.user.js
// @match        *://www.indiegala.com/gift?gift_id=*
// @match      	 *steamcn.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    jQuery(document).ready(function () {
        var aCount = 0;
        var aList = [];
        var sourceStr = "ig";
        var divButton = document.createElement('div');
        divButton.id = 'bh_OpenSg';
        divButton.style.position = 'fixed';
        divButton.title = 'Search Sg';
        if (location.host == "steamcn.com") {
            sourceStr = "stcn";
        } else if (location.host == "www.indiegala.com") {
            sourceStr = "ig";
        }
        if (sourceStr == "ig") {
            var eleA = document.createElement('a');
            eleA.setAttribute('onclick', 'return false;');
            eleA.textContent = 'Search Sg';
            divButton.appendChild(eleA);
            $('div.giftprof_key').find('a.game-steam-url').each(function (index, n) {
                aList.push($(n).innerHTML);
            });
            aCount = $('div.giftprof_key').find('a.game-steam-url').length;
            divButton.classList.add('bh_button');
            divButton.style.bottom = '80px';
            divButton.style.right = '20px';
        } else if (sourceStr == "stcn") {
            aCount = $('body').find('a.steamInfoLink').not(".linkOwn").length;
            $('body').find('a.steamInfoLink').not(".linkOwn").each(function (index, n) {
                var tempName = $(n).text().replace(/_/g, "%20");
                //var str1 = "1dsdasfs2（23321）"
                var s1 = tempName.indexOf('（');
                var s2 = tempName.indexOf('）');
                if (s1 > -1 && s2 > -1 && s2 > s1) {
                    tempName = tempName.substring(s1, s2 - s1);
                }
                aList.push(tempName);
            });
            divButton.classList.add('backToTop');
            divButton.style.bottom = '100px';
            divButton.style.right = '50px';
            divButton.style.width = '55px';
            divButton.style.height = '55px';
            divButton.style.background = 'url("/template/steamcn_metro/src/img/common/nav-search.png") center center no-repeat rgb(87, 186, 232)';
            divButton.style.cursor = "pointer";
        }
        document.body.appendChild(divButton);
        divButton.addEventListener('click', function () {
            aCount = 0;
            aList = [];
            if (sourceStr == "ig") {
                $('div.giftprof_key').find('a.game-steam-url').each(function (index, n) {
                    aList.push($(n).html());
                });
                aCount = $('div.giftprof_key').find('a.game-steam-url').length;
            } else if (sourceStr == "stcn") {
                aCount = $('body').find('a.steamInfoLink').not(".linkOwn").length;
                $('body').find('a.steamInfoLink').not(".linkOwn").each(function (index, n) {
                    var tempName = $(n).text().replace(/_/g, "%20");
                    //var str1 = "1dsdasfs2（23321）"
                    var s1 = tempName.indexOf('（');
                    var s2 = tempName.indexOf('）');
                    if (s1 > -1 && s2 > -1 && s2 > s1) {
                        tempName = tempName.substring(s1, s2 - s1);
                    }
                    aList.push(tempName);
                });
            }
            for (var i = 0; i < aCount; i++) {
                window.open('https://www.steamgifts.com/giveaways/entered/search?q=' + aList[i]);
            }
        });
    });
})();