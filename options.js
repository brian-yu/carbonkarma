'use strict';

function clearCart() {
  setProducts([]);
}

document.getElementById("clearCartBtn").addEventListener('click', clearCart);

function setProducts(productList) {

  chrome.storage.local.set({cartProducts: productList});

  const products = document.getElementById('products');
  products.innerHTML = '';
  let num = 1;
  let totalCost = 0;
  for (const product of productList) {
    console.log(product)
    const row = document.createElement('tr');
    row.id = "row" + num.toString();
    const idx = document.createElement('th');
    idx.innerText = num;
    const name = document.createElement('td');
    name.innerText = product.productName;
    const carbon = document.createElement('td');
    carbon.id = "carbon" + num.toString();
    if(product.isUsed){
      carbon.innerText = '$' + product.usedOffsetPrice.scalar;
    } else{
      carbon.innerText = '$' + product.offsetPrice.scalar;
    }
    const buttons = document.createElement('td');
    buttons.className = 'btn-group btn-group-sm';
    const markUsedBtn = document.createElement('button');
    if(product.isUsed){
      markUsedBtn.className = 'btn btn-sm btn-secondary';
      markUsedBtn.addEventListener('click', () => {
        const idx = productList.indexOf(product);
        if (idx > -1) {
          productList[idx].isUsed = false;
        }
        setProducts(productList);
      })
      markUsedBtn.innerText = 'Buy New';
    }else{
      markUsedBtn.className = 'btn btn-sm btn-success';
      markUsedBtn.addEventListener('click', () => {
        const idx = productList.indexOf(product);
        if (idx > -1) {
          productList[idx].isUsed = true;
        }
        setProducts(productList);
      })
      markUsedBtn.innerText = 'Buy Used';
    }
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-danger ml-1';
    removeBtn.addEventListener('click', () => {
      const idx = productList.indexOf(product);
      if (idx > -1) {
        productList.splice(idx, 1);
      }
      setProducts(productList);
      return;
    })
    removeBtn.innerText = 'Remove';
    buttons.appendChild(markUsedBtn);
    buttons.appendChild(removeBtn);
    row.appendChild(idx);
    row.appendChild(name);
    row.appendChild(carbon);
    row.appendChild(buttons);
    products.appendChild(row);
    num += 1;
    if(product.isUsed){
      totalCost += product.usedOffsetPrice.scalar;
    }else{
      totalCost += product.offsetPrice.scalar;
    }
    
  }
  document.getElementById('total').innerText = '$' + Qty(totalCost).toPrec('0.01').scalar;
}

function retrieveAndDisplayProducts() {
  chrome.storage.local.get(['cartProducts'], function(result) {
    const currentProducts = result.cartProducts ? result.cartProducts : [];
    setProducts(currentProducts);
  });
}
retrieveAndDisplayProducts();

window.addEventListener('focus', retrieveAndDisplayProducts);