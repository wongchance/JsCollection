// ==UserScript==
// @name         missionIngress
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://mission-author-dot-betaspike.appspot.com/
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/ingressmm.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/ingressmm.extend.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    jQuery(document).ready(function () {

        var navbarHtml = '<ul class="nav navbar-nav navbar-login" style=" float: left !important;">' +
            '<li class="dropdown open">' +
            '<a href="" class="dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon"></span>' +
            'IngressMM extension <b class="caret"></b>' +
            '</a>' +
            '<ul class="dropdown-menu">' +
            '<li><a id="newReviewlist" target="_self"><span class="glyphicon"></span> in New Review</a></li>' +
            '<li><a id="editReviewlist" target="_self"><span class="glyphicon"></span> in Edit Review</a></li>' +
            '<li><a id="publishedlist" target="_self"><span class="glyphicon"></span> published</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>';

        jQuery('div.navbar-collapse').append(navbarHtml);
        jQuery('#newReviewlist')[0].addEventListener('click', showNewReviewlist);
        jQuery('#editReviewlist')[0].addEventListener('click', showEditReviewlist);
        jQuery('#publishedlist')[0].addEventListener('click', showPublishedlist);
    });



    function showNewReviewlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-draft'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }

    function showEditReviewlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-submitted_and_published'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }

    function showPublishedlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-published'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }

})();

