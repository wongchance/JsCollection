// ==UserScript==
// @name         5 Star One Key
// @version      0.26
// @description  Give five star with single click
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/5_Star_One_Key_fix.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/5_Star_One_Key_fix.user.js
// @author       jqqqqqqqqqq
// @match        https://opr.ingress.com/recon
// @grant        none
// ==/UserScript==

var buttons = [{
    button: '2',
    total: 2,
    name: 2,
    history: 2,
    unique: 2,
    location: 2,
    safety: 2
  },
  {
    button: '3',
    total: 3,
    name: 3,
    history: 3,
    unique: 3,
    location: 3,
    safety: 3
  },
  {
    button: '4',
    total: 4,
    name: 4,
    history: 4,
    unique: 4,
    location: 4,
    safety: 4
  },
  {
    button: '5',
    total: 5,
    name: 5,
    history: 5,
    unique: 5,
    location: 5,
    safety: 5
  }
];

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////DO NOT EDIT THIS LINE BELOW!
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function rate_portal(total, name, history, unique, location, safety) {
  document.querySelector('#AnswersController > form > div:nth-child(1) > div:nth-child(1)  > div.text-center > div.btn-group > button:nth-child(' + total + ')').click();
  document.querySelector('#AnswersController > form > div:nth-child(1) > div.col-xs-12.col-sm-4.pull-right.text-center.hidden-xs > div > div:nth-child(5) > button:nth-child(' + name + ')').click();
  document.querySelector('#AnswersController > form > div:nth-child(1) > div.col-xs-12.col-sm-4.pull-right.text-center.hidden-xs > div > div:nth-child(10) > button:nth-child(' + history + ')').click();
  document.querySelector('#AnswersController > form > div:nth-child(1) > div.col-xs-12.col-sm-4.pull-right.text-center.hidden-xs > div > div:nth-child(15) > button:nth-child(' + unique + ')').click();
  document.querySelector('#AnswersController > form > div:nth-child(2) > div.col-xs-12.col-sm-6.text-center.col-sm-pull-6 > div:nth-child(6) > button:nth-child(' + location + ')').click();
  document.querySelector('#AnswersController > form > div:nth-child(2) > div.col-xs-12.col-sm-6.text-center.col-sm-pull-6 > div:nth-child(11) > button:nth-child(' + safety + ')').click();
}

function add_button() {
  var button_region = document.getElementById('submitDiv');
  buttons.forEach(function (button_data) {
    var button = document.createElement('button');
    var textnode = document.createTextNode(button_data.button);
    button.className = 'button big-submit-button';
    button.appendChild(textnode);
    button_region.appendChild(button);
    button.onclick = function () {
      rate_portal(button_data.total, button_data.name, button_data.history, button_data.unique, button_data.location, button_data.safety);
    };
  });
}

(function () {
  add_button();
})();