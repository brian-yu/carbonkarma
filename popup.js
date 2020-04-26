'use strict';

const product = document.getElementById('product');
const dimensions = document.getElementById('dimensions');
const weight = document.getElementById('weight');
const transport = document.getElementById('transport');
const cars = document.getElementById('cars');
const burgers = document.getElementById('burgers');
const bulb = document.getElementById('bulb');
const packaging = document.getElementById('packaging');
const total = document.getElementById('total');
const offset = document.getElementById('offset');

var offsetPrice;

chrome.storage.local.get(['currentProduct'], function(result) {
  const currentProduct = result.currentProduct;
  console.log(currentProduct);
  
  product.innerText = currentProduct.productName;

  // Material Emissions
  var materialEmissions = Qty(currentProduct.materialEmissions);
  if(materialEmissions.lt('10 kg')){
    materials.innerText = materialEmissions.toPrec('0.01 kg') + ' CO2';
  } else{
    materials.innerText = materialEmissions.toPrec('1 kg') + ' CO2';
  }

  var parseWeight = Qty(currentProduct.shippingWeight);
  // weight.innerText = 'Weight: ' + parseWeight.to('lb').toPrec('0.5 lb');
  
  // SOURCE: https://business.edf.org/insights/green-freight-math-how-to-calculate-emissions-for-a-truck-move/
  // avg miles * item weight in tons * co2 emission/ton-mile
  console.log('shipping weight: ' + parseWeight);
  const transportEmissions = Qty(currentProduct.transportEmissions);
  if(transportEmissions.lt('10 g')){
    transport.innerText = transportEmissions.toPrec('0.01 g') + ' CO2';
  } else{
    transport.innerText = transportEmissions.toPrec('1 g') + ' CO2';
  }

  const packagingEmissions = Qty(currentProduct.packagingEmissions).mul(Qty('0.532 lb')).div(Qty('1 lb')).to('g');
  if(packagingEmissions.lt('10 g')){
    packaging.innerText = packagingEmissions.toPrec('0.01 g') + ' CO2';
  }else{
    packaging.innerText = packagingEmissions.toPrec('1 g') + ' CO2';
  }


  const totalEmissions = Qty(currentProduct.totalEmissions); // in grams
  if(totalEmissions.lt('10 kg')){
    total.innerText = totalEmissions.toPrec('0.01 kg') + ' CO2';
  }else{
    total.innerText = totalEmissions.toPrec('1 kg') + ' CO2';
  }
  

  // SOURCE: https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle
  // 404 grams / mile
  var carEmissions = Qty(currentProduct.carEmissions);
  if(carEmissions.lt('10')){
    cars.innerText = carEmissions.toPrec('0.01');
  }else{
    cars.innerText = carEmissions.toPrec('1');
  }
  // SOURCE: https://www.businessinsider.com/one-hamburger-environment-resources-2015-2
  // 4 pounds / quarter pound burger
  var burgerEmissions = Qty(currentProduct.burgerEmissions);
  if(burgerEmissions.lt('10')){
    burgers.innerText = burgerEmissions.toPrec('0.01');
  }else{
    burgers.innerText = burgerEmissions.toPrec('1');
  }
  // SOURCE: http://www.tenmilliontrees.org/trees/
  // 50 year life span * 48 lbs / year
  // trees.innerText = totalEmissions.to('lb').div(Qty('48 lbs')).toPrec('0.01');
  // SOURCE: 
  // average incandescant lightbulbs produce 13 g of CO2 per hour
  var bulbEmissions = Qty(currentProduct.bulbEmissions);
  if(bulbEmissions.lt('10')){
    bulb.innerText = bulbEmissions.toPrec('0.01');
  }else{
    bulb.innerText = bulbEmissions.toPrec('1');
  }

  // SOURCE: https://www.terrapass.com/product/productindividuals-families
  // cost of carbon offset: $0.005 / lb CO2
  offsetPrice = Qty(currentProduct.offsetPrice);
  offset.innerText = '$' + offsetPrice;
  console.log('offset price:' + offsetPrice);
});


document.getElementById('optionsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
})