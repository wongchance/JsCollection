// ==UserScript==
// @name         Mission Author Extension
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       wongchance
// @match        https://mission-author-dot-betaspike.appspot.com/*
// @match        http://missions.ingress.com*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/misson-author.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/misson-author.extend.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    jQuery(document).ready(function () {

        // var url = window.location.href;
        // if (url.indexOf('edit') > -1) {

        var t0 = setInterval(function () {
            if (jQuery('input[ng-model="mission.definition.name"]').length > 0 && jQuery('#savedspStoragebtn').length < 1) {
                var storageDspButton = '<div class="form-group"><button class="button" id="savedspStoragebtn">save</button> <button class="button" id="loaddspStoragebtn">load</button></div>';
                jQuery('input[ng-model="mission.definition.name"]').parent().parent().append(storageDspButton);
                jQuery('#savedspStoragebtn')[0].addEventListener('click', savedspStorage);
                jQuery('#loaddspStoragebtn')[0].addEventListener('click', loaddspStorage);
                //clearInterval(t0);
            }

            if ($('button.create-mission-button').length > 0 && jQuery('#alllist').length < 1) {
                var navbarHtml = '<ul class="nav navbar-nav navbar-login" style=" float: left !important;">' +
                    '<li class="dropdown">' +
                    '<a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">' +
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
                    '<a href="javascript:void(0)" id="publishedCount" class="dropdown-toggle" data-toggle="dropdown">' +
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
                showAlllist();
                //clearInterval(t1);
            }

            if ($('span.input-group-btn').length > 0 && jQuery('#saveLocBtn').length < 1) {
                var storagelocButton = '<button class="smaller flat transparent" id="saveLocBtn">save</button><button class="smaller flat transparent" id="loadLocBtn">load</button>';
                jQuery('span.input-group-btn').eq(0).append(storagelocButton);
                jQuery('#saveLocBtn')[0].addEventListener('click', savelocStorage);
                jQuery('#loadLocBtn')[0].addEventListener('click', loadlocStorage);
            } else if ($('span.input-group-btn').length > 0 && jQuery('#saveLocBtn').length > 0) {
                // if (confirm("location found,to do load?")) {
                //     jQuery('#loadLocBtn')[0].click();
                // }
            }

        }, 1000);

    });


    function loadlocStorage(event) {
        var storage = window.localStorage;
        if (!storage["loc"]) {
            // if (!storage["name"] && !storage["description"]) {
            //     if (confirm("name and description are both empty,still load?")) {
            //         jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
            //         jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);

            //     }
            // } else if (!storage["name"]) {
            //     if (confirm("name is empty,still load?")) {
            //         jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
            //         jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);

            //     }
            // } else if (!storage["description"]) {
            //     if (confirm("description is empty,still load?")) {
            //         jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
            //         jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);
            //     }
            // }
            alert("location not found");
        } else {
            jQuery('#autocomplete').val(storage["loc"]);
            $('span.glyphicon.glyphicon-search')[0].click();
        }


    }

    function savelocStorage(event) {
        var storage = window.localStorage;
        storage["loc"] = jQuery('#autocomplete').val();
        //storage["description"] = jQuery('textarea[ng-model="mission.definition.description"]').val();
    }

    function loaddspStorage(event) {
        var storage = window.localStorage;
        if (!storage["name"] || !storage["description"]) {
            if (!storage["name"] && !storage["description"]) {
                if (confirm("name and description are both empty,still load?")) {
                    jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
                    jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);

                }
            } else if (!storage["name"]) {
                if (confirm("name is empty,still load?")) {
                    jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
                    jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);

                }
            } else if (!storage["description"]) {
                if (confirm("description is empty,still load?")) {
                    jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
                    jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);
                }
            }
        } else {
            jQuery('input[ng-model="mission.definition.name"]').val(storage["name"]);
            jQuery('textarea[ng-model="mission.definition.description"]').val(storage["description"]);
        }


    }

    function savedspStorage(event) {
        var storage = window.localStorage;
        storage["name"] = jQuery('input[ng-model="mission.definition.name"]').val();
        storage["description"] = jQuery('textarea[ng-model="mission.definition.description"]').val();
    }


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
            return $(a).find('span.name')[0].innerText.trim().localeCompare($(b).find('span.name')[0].innerText.trim()); //从大到小
        });
        $('.missions-list').empty();
        for (var i = 0; i < newrows.length; i++) {
            $('div.missions-list').append($(newrows[i]));
        }
        return newrows;
    }


    // var rows = $('div.missions-list').find('div.row.mission');
    // for (var i = 0; i < rows.length; i++) {
    //     var name = $(rows[i]).find('span.name')[0].innerText.trim();
    //     name=name.replace('0','');
    //     console.log(name);
    //     var match = name.match(/[0-9０-９①-⑱\u2460-\u2473\u3251-\u32bf]+/);
    //     match[0] = match[0].replace(/[①-⑱]/g, function (n) { return n.charCodeAt(0) - "①".charCodeAt(0) + 1 });
    //     match[0] = match[0].replace(/[０-９]/g, function (n) { return n.charCodeAt(0) - "０".charCodeAt(0) });
    //     match[0] = match[0].replace(/[\u2460-\u2473]/g, function (n) { return n.charCodeAt(0) - "①".charCodeAt(0) + 1 });
    //     match[0] = match[0].replace(/[\u3251-\u32bf]/g, function (n) { return n.charCodeAt(0) - "㉑".charCodeAt(0) + 21 });
    //     console.log(match[0]);

    // }

})();