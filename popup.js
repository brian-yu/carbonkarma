'use strict';

const product = document.getElementById('product');
const dimensions = document.getElementById('dimensions');
const weight = document.getElementById('weight');
const emissions = document.getElementById('emissions');
const cars = document.getElementById('cars');
const burgers = document.getElementById('burgers');
const trees = document.getElementById('trees');
const packaging = document.getElementById('packaging');

chrome.storage.local.get(['currentProduct'], function(result) {
  const currentProduct = result.currentProduct;
  
  product.innerText = currentProduct.productName;

  var parseWeight = currentProduct.shippingWeight;
  var lbsWeight = Qty(parseWeight);
  weight.innerText = 'Weight: ' + lbsWeight.to('lb').toPrec('0.5 lb');
  
  // SOURCE: https://business.edf.org/insights/green-freight-math-how-to-calculate-emissions-for-a-truck-move/
  // avg miles * item weight in tons * co2 emission/ton-mile
  console.log(parseWeight);
  console.log(lbsWeight);
  emissions.innerText = 'Emissions: ' + lbsWeight.to('ton')
                          .mul(Qty('1500 miles'))
                          .mul(Qty('161.8 gram'))
                          .div(Qty('1 ton'))
                          .div(Qty('1 mile'))
                          + ' CO2';

  dimensions.innerText = currentProduct.productDimensions;
  const match = currentProduct.productDimensions.match(
    /(?<length>\d*\.?\d*)\s+x\s+(?<width>\d*\.?\d*)\s+x\s+(?<height>\d*\.?\d*)\s+(?<unit>\w+)/
  )

  const length = parseFloat(match.groups.length);
  const width = parseFloat(match.groups.width);
  const height = parseFloat(match.groups.height);
  const unit = match.groups.unit;


  const surfaceArea = Qty(length, unit)
                        .mul(Qty(width, unit))
                        .mul(Qty(height, unit))
  
  packaging.innerText = 'Packaging: ' + surfaceArea;

  // SOURCE: 

});