
window.addEventListener('DOMContentLoaded', (event) => {
    storeProductInfo();
});

try {
    storeProductInfo();
} catch (err) {
    console.log(err)
    console.log("Could not get product info.")
}

chrome.storage.local.get(['cartProducts'], function(result) {
    console.log("CART")
    console.log(result.cartProducts)
});


async function storeProductInfo() {
    console.log("AMAZON PRODUCT")

    const url = window.location.pathname;
    const id = url.match(/[d|g]p\/(\w+)(\?|$|\/)/)[1];
    const productName = document.getElementById("productTitle").innerText;

    // Get category mapping:
    var mappingURL = chrome.runtime.getURL("data/mapping.json");
    const response = await fetch(mappingURL);
    const mapping = await response.json();
    const productCategory = document.getElementById("nav-subnav").getAttribute("data-category");
    let co2KgPerDollar = null;
    if (mapping.hasOwnProperty(productCategory)) {
        co2KgPerDollar = mapping[productCategory].co2_kg;
    } else {
        co2KgPerDollar = mapping["default"].co2_kg;
    }
    console.log(co2KgPerDollar)

    // TODO: make more robust
    let rawPrice = null;
    try{
        var priceElem = document.getElementById('priceblock_saleprice');
        rawPrice = priceElem.innerText;
    }catch{
        try{
            var priceElem = document.getElementById('priceblock_ourprice');
            rawPrice = priceElem.innerText;
        }catch{
            for (const priceElem of document.getElementsByClassName("a-color-price")) {
                rawPrice = priceElem.innerText;
                break
            }
        }
    }
    const price = parseFloat(rawPrice.replace(/\$|,/g, ""))

    // Calculate Emissions 
    const materialEmissions = co2KgPerDollar*price;

    console.log(`PRODUCT ID: ${id}`);
    console.log(`PRODUCT NAME: ${productName}`);
    console.log(`PRODUCT PRICE: ${price}`);
    console.log(`PRODUCT CATEGORY: ${productCategory}`);
    console.log(`PRODUCT EMISSIONS: ${materialEmissions}`);

    let weight = null;
    let dimensions = null;
    var found = false;

    let details = document.getElementById('prodDetails');

    if (details) {
        const tableRows = details.getElementsByTagName("tr");

        for (const row of tableRows) {
            th = row.getElementsByTagName("th")
            td = row.getElementsByTagName("td")
            const text = row.innerText;
            try {
                if (text.includes('Shipping Weight')) {
                    
                    weight = td[0].innerText.split(' ').slice(0,2).join(' ');
                    found = true;
                }
                if (text.includes('Product Dimensions')) {
                    dimensions = td[0].innerText;
                    found = true;
                }
            } catch {
                continue;
            }
        }
    }

    

    // some product information is in lists instead of tables
    const listItems = document.getElementsByTagName("li");
    if(!found){
        for (const item of listItems) {
            if (item.innerText.includes("Weight")) {
                console.log(item.innerText)
                weight = item.innerText.match(/.*Weight:\s(\d*\.?\d*\s\w+)/)[1]
            }
            if (item.innerText.includes("Dimensions") ||
                item.innerText.includes("Size")) {
                console.log(item.innerText)
                // dimensions = item.innerText.match(
                //     /(\d*\.?\d*\s+x\s+\d*\.?\d*\s+x\s+\d*\.?\d*\s+x\s+\w+)/)[1]
                dimensions = item.innerText.split(":")[1]
            }
        }
    }

    console.log('shipping weight: ' + weight);
    console.log('product dimensions: ' + dimensions);

    const toStore = {[id]: {
        productName,
        materialEmissions,
        shippingWeight: weight,
        productDimensions: dimensions,
    }};

    chrome.storage.local.set(toStore, function() {
        console.log(`Stored`);
        console.log(toStore)
    });

    const currentProduct = {currentProduct: {
        id,
        ...toStore[id]
    }};
    chrome.storage.local.set(currentProduct, function() {
        console.log(`Stored`);
        console.log(currentProduct)
    });



    const cartButton = document.getElementById('add-to-cart-button');
    console.log(cartButton)
    cartButton.addEventListener('click', () => {
        chrome.storage.local.get(['cartProducts'], function(result) {
            const currentProducts = result.cartProducts ? result.cartProducts : [];
            const products = {
                cartProducts: currentProducts.concat([currentProduct])
            };
            chrome.storage.local.set(products, function() {
                console.log(`Stored`);
                console.log(products)
            });
        });
    })
}