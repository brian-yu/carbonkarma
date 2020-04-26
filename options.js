// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const products = document.getElementById('products');

chrome.storage.local.get(['cartProducts'], function(result) {
  const currentProducts = result.cartProducts ? result.cartProducts : [];
  for (const product of currentProducts) {
    const elem = document.createElement('div');
    elem.innerText = product.currentProduct.productName;
    products.appendChild(elem);
  }
});