// ==UserScript==
// @name         Mission Author Extension
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  try to take over the world!
// @author       wongchance
// @match        https://mission-author-dot-betaspike.appspot.com/*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/misson-author.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/misson-author.extend.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    jQuery(document).ready(function () {

        var navbarHtml = '<ul class="nav navbar-nav navbar-login" style=" float: left !important;">' +
            '<li class="dropdown">' +
            '<a href="" class="dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon"></span>' +
            'Extension <b class="caret"></b>' +
            '</a>' +
            '<ul class="dropdown-menu">' +
            '<li><a id="alllist" target="_self"><span class="glyphicon"></span> all</a></li>' +
            '<li><a id="newDraftlist" target="_self"><span class="glyphicon"></span> new Draft</a></li>' +
            '<li><a id="editDraftlist" target="_self"><span class="glyphicon"></span> edit Draft</a></li>' +
            '<li><a id="newReviewlist" target="_self"><span class="glyphicon"></span> in New Review</a></li>' +
            '<li><a id="editReviewlist" target="_self"><span class="glyphicon"></span> in Edit Review</a></li>' +
            '<li><a id="publishedlist" target="_self"><span class="glyphicon"></span> published</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>';

        var publishedCount = 0;
        // var rowsCount = $('div.missions-list').find('div.row.mission');
        // for (var i = 0; i < rowsCount.length; i++) {
        //     if ($(rowsCount[i]).attr('ng-class') == "'mission-list-item-submitted_and_published'" ||
        //         $(rowsCount[i]).attr('ng-class') == "'mission-list-item-published'" ||
        //         $(rowsCount[i]).attr('ng-class') == "'mission-list-item-draft_of_published_mission'") {
        //         publishedCount = publishedCount + 1;
        //     }
        // }
        var navbarCountHtml = '<ul class="nav navbar-nav navbar-login" style=" float: left !important;">' +
            '<li class="dropdown">' +
            '<a href="" id="publishedCount" class="dropdown-toggle" data-toggle="dropdown">' +
            'published Count: ' + publishedCount +
            '</a>' +
            '</li>' +
            '</ul>';

        jQuery('div.navbar-collapse').append(navbarHtml);
        jQuery('div.navbar-collapse').append(navbarCountHtml);

        jQuery('#alllist')[0].addEventListener('click', showAlllist);
        jQuery('#newDraftlist')[0].addEventListener('click', showNewDraftlist);
        jQuery('#editDraftlist')[0].addEventListener('click', showEditDraftlist);

        jQuery('#newReviewlist')[0].addEventListener('click', showNewReviewlist);
        jQuery('#editReviewlist')[0].addEventListener('click', showEditReviewlist);
        jQuery('#publishedlist')[0].addEventListener('click', showPublishedlist);



        var t1 = setInterval(function () {
            if ($('button.create-mission-button').length > 0) {
                showAlllist();
                clearInterval(t1);
            }
        }, 1000);
    });

    function showAlllist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        rows = resort(rows);

        var publishedCount = 0;
        for (var i = 0; i < rows.length; i++) {
            $(rows[i]).show();
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-submitted_and_published'" ||
                $(rows[i]).attr('ng-class') == "'mission-list-item-published'" ||
                $(rows[i]).attr('ng-class') == "'mission-list-item-draft_of_published_mission'") {
                //alert(1);
                publishedCount = publishedCount + 1;
            }
        }
        jQuery('#publishedCount')[0].innerText = 'published Count: ' + publishedCount;
    }

    function showNewReviewlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        rows = resort(rows);

        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-submitted'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }

    function showEditReviewlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        rows = resort(rows);

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
        rows = resort(rows);

        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-published'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }


    function showNewDraftlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        rows = resort(rows);

        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-draft'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }



    function showEditDraftlist(event) {
        var rows = $('div.missions-list').find('div.row.mission');
        rows = resort(rows);
        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i]).attr('ng-class') == "'mission-list-item-draft_of_published_mission'") {
                $(rows[i]).show();
            } else {
                $(rows[i]).hide();
            }
        }
    }

    function resort(rows) {
        var newrows = rows.sort(function (a, b) { //利用数组的排序方法重新排序对象
            return $(a).find('span.name')[0].innerText.trim().localeCompare($(b).find('span.name')[0].innerText.trim());  //从大到小
        });
        $('.missions-list').empty();
        for (var i = 0; i < newrows.length; i++) {
            $('div.missions-list').append($(newrows[i]));
        }
        return newrows;
    }

    // var rows = $('div.missions-list').find('div.row.mission'); 
    // rows = rows.sort(function (a, b) { //利用数组的排序方法重新排序对象
    //     return $(a).find('span.name')[0].innerText.trim().localeCompare($(b).find('span.name')[0].innerText.trim());  //从大到小
    // });
    // $('.missions-list').empty();
    // for (var i = 0; i < rows.length; i++) {
    //     $('div.missions-list').append($(rows[i]));
    // }

})();