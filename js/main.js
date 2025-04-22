import headerFunc from "./header.js"
import productFunc from "./product.js"
import searchFunc from "./search.js"

//! add product to localstorage start

(async function () {

    const products = await fetch("js/data.json")
    const data = await products.json()


    data ? localStorage.setItem("products", JSON.stringify(data)) : []
    productFunc(data)
    searchFunc(data)

}
)()



const cartItem = document.querySelector(".header-cart-count")

cartItem.innerHTML = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")).length
    : "0"

//! add cartItem to localstorage end


