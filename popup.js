// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };



let calculate = document.getElementById('calculate');
calculate.onclick = function(element) {
  var aTags = document.getElementsByTagName("th");
  var searchText = "Shipping Weight";
  var found;

  for (var i = 0; i < aTags.length; i++) {
    console.log(aTags[i])
    if (aTags[i].content.contains(searchText)) {
      found = aTags[i];
      break;
    }
  }

  console.log(found)
};