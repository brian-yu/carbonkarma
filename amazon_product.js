
window.addEventListener('DOMContentLoaded', (event) => {
    storeProductInfo();
});

storeProductInfo();

function storeProductInfo() {
    console.log("AMAZON PRODUCT")

    const url = window.location.pathname;
    const id = url.match(/[d|g]p\/(\w+)(\?|$|\/)/)[1];
    const productName = document.getElementById("productTitle").innerText;

    console.log(`PRODUCT ID: ${id}`);
    console.log(`PRODUCT NAME: ${productName}`);

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
            if (item.innerText.includes("Shipping Weight")) {
                console.log(item.innerText)
                weight = item.innerText.match(/.*Weight:\s(\d*\.?\d*\s\w+)/)[1]
            }
            if (item.innerText.includes("Product Dimensions")) {
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
}