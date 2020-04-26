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

chrome.storage.local.get(['currentProduct'], function(result) {
  const currentProduct = result.currentProduct;
  
  product.innerText = currentProduct.productName;

  var parseWeight = Qty(currentProduct.shippingWeight);
  // weight.innerText = 'Weight: ' + parseWeight.to('lb').toPrec('0.5 lb');
  
  // SOURCE: https://business.edf.org/insights/green-freight-math-how-to-calculate-emissions-for-a-truck-move/
  // avg miles * item weight in tons * co2 emission/ton-mile
  console.log(parseWeight);
  const transportEmissions = parseWeight.to('ton')
                              .mul(Qty('1500 miles'))
                              .mul(Qty('161.8 gram'))
                              .div(Qty('1 ton'))
                              .div(Qty('1 mile'));
  if(transportEmissions.lt('10 g')){
    transport.innerText = transportEmissions.toPrec('0.01 g') + ' CO2';
  } else{
    transport.innerText = transportEmissions.toPrec('1 g') + ' CO2';
  }

  // dimensions.innerText = currentProduct.productDimensions;
  const match = currentProduct.productDimensions.match(
    /(?<length>\d*\.?\d*)\s+x\s+(?<width>\d*\.?\d*)\s+x\s+(?<height>\d*\.?\d*)\s+(?<unit>\w+)/
  )
  const length = parseFloat(match.groups.length);
  const width = parseFloat(match.groups.width);
  const height = parseFloat(match.groups.height);
  const unit = match.groups.unit;

  const lengthQty = Qty(length, unit).to('m');
  const widthQty = Qty(width, unit).to('m');
  const heightQty = Qty(height, unit).to('m');
  const surfaceArea = lengthQty.mul(widthQty).mul(2)
                      .add(lengthQty.mul(heightQty).mul(2))
                      .add(widthQty.mul(heightQty).mul(2))
  const volume = surfaceArea.mul('4 cm'); // average thickness of cardboard packaging?
  // SOURCE: https://www.hunker.com/13419984/the-density-of-corrugated-cardboard
  // density of cardboard: 60 kg/m^3
  const packagingWeight = volume.mul(Qty('60 kg')).div(Qty('1 m')).div(Qty('1 m')).div(Qty('1 m')).to('lb');
  // SOURCE: https://www.corrugated.org/carbon-footprint-calculator/
  // emissions of cardboard: 0.532 lb CO2 / lb cardboard
  const packagingEmissions = packagingWeight.mul(Qty('0.532 lb')).div(Qty('1 lb')).to('g');
  if(packagingEmissions.lt('10 g')){
    packaging.innerText = packagingEmissions.toPrec('0.01 g') + ' CO2';
  }else{
    packaging.innerText = packagingEmissions.toPrec('1 g') + ' CO2';
  }


  const totalEmissions = transportEmissions.add(packagingEmissions); // in grams
  if(totalEmissions.lt('10 g')){
    total.innerText = totalEmissions.toPrec('0.01 g') + ' CO2';
  }else{
    total.innerText = totalEmissions.toPrec('1 g') + ' CO2';
  }
  

  // SOURCE: https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle
  // 404 grams / mile
  var carEmissions = totalEmissions.to('grams').div(Qty('404 grams'));
  if(carEmissions.lt('10')){
    cars.innerText = carEmissions.toPrec('0.01');
  }else{
    cars.innerText = carEmissions.toPrec('1');
  }
  // SOURCE: https://www.businessinsider.com/one-hamburger-environment-resources-2015-2
  // 4 pounds / quarter pound burger
  var burgerEmissions = totalEmissions.to('lb').div(Qty('4 lbs'));
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
  var bulbEmissions = totalEmissions.to('g').div(Qty('13 g'));
  if(bulbEmissions.lt('10')){
    bulb.innerText = bulbEmissions.toPrec('0.01');
  }else{
    bulb.innerText = bulbEmissions.toPrec('1');
  }

  // SOURCE: https://www.terrapass.com/product/productindividuals-families
  // cost of carbon offset: $0.005 / lb CO2
  offset.innerText = '$' + totalEmissions.to('lbs').mul('0.005 dollar').div('1 lb').toPrec('0.01 dollar');

});


document.getElementById('optionsBtn').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
})