import { product1, product2 } from "./glide.js"


export let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart")) : []


function addToCart(products) {
    const cartItem = document.querySelector(".header-cart-count")
    const buttons = [...document.getElementsByClassName("add-to-cart")]
    buttons.forEach((button) => {
        const inCart = cart.find((item) => item.id === Number(button.dataset.id))
        if (inCart) {
            button.setAttribute("disabled", "disabled")
        } else {
            button.addEventListener("click", function (e) {
                const id = e.target.dataset.id
                const findProduct = products.find((product) => product.id === Number(id))
                cart.push({ ...findProduct, quantity: 1 })
                localStorage.setItem("cart", JSON.stringify(cart))
                button.setAttribute("disabled", "disabled")
                cartItem.innerHTML = cart.length
            })
        }
    })
}

function productRoute() {
    const productLink = document.getElementsByClassName("product-link")
    Array.from(productLink).forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault()
            const id = e.target.dataset.id
            localStorage.setItem("productId", JSON.stringify(id))
            window.location.href = "single-product.html"
        })
    })
}


function productImageRoute() {
    const productImageLink = document.querySelectorAll(".product-image a .img2")
    productImageLink.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault()
            const id = e.target.dataset.id
            localStorage.setItem("productId", JSON.stringify(id))
            window.location.href = "single-product.html"
        })
    })
}

function chatRoute() {
    const chatLinks = document.getElementsByClassName("chat-link");
    Array.from(chatLinks).forEach((chatLink) => {
        chatLink.addEventListener("click", (e) => {
            e.preventDefault();
            const id = e.currentTarget.getAttribute("data-id");
            if (id) {
                window.location.href = `frontend/index.html?productId=${id}`;
            } else {
                alert("No product ID found.");
            }
        });
    });
}



async function productFunc(products) {


    const productsContainer = document.getElementById("product-list")
    const productsContainer2 = document.getElementById("product-list-2")
    let results = ""

    products.forEach((product) => {
        results += `
                <li class="product-item glide__slide">
                    <div class="product-image">
                        <a href="" >
                            <img src="${product.img.singleImage}" alt="" class="img1" />
                            <img src="${product.img.thumbs[1]}" alt="" class="img2" data-id="${product.id}" />
                        </a>
                    </div>
                    <div class="product-info">
                    <a href="#" class="product-title"> ${product.name} </a>
                    <ul class="product-star">
                        <li>
                        <i class="bi bi-star-fill"></i>
                        </li>
                        <li>
                        <i class="bi bi-star-fill"></i>
                        </li>
                        <li>
                        <i class="bi bi-star-fill"></i>
                        </li>
                        <li>
                        <i class="bi bi-star-fill"></i>
                        </li>
                        <li>
                        <i class="bi bi-star-half"></i>
                        </li>
                    </ul>
                    <div class="product-prices">
                        <strong class="new-price">₹${product.price.newPrice.toFixed(2)}</strong>
                        <span class="old-price">₹${product.price.oldPrice.toFixed(2)}</span>
                    </div>
                    <div class="product-links">
                        <button class="add-to-cart" data-id="${product.id}">
                        <i class="bi bi-basket-fill"></i>
                        </button>
                        <a href="#" class="product-link" data-id="${product.id}">
                        <i class="bi bi-eye-fill"></i>
                        <a href="#" class="chat-link" data-id="${product.id}">
  <i class="bi bi-chat-dots-fill"></i>
</a>
                    </div>
                    </div>
            </li>
        `

    })

    productsContainer ? productsContainer.innerHTML = results : ""
    productsContainer ? productsContainer2.innerHTML = results : ""

    addToCart(products)

    product1()

    product2()

    productRoute()

    productImageRoute()

    chatRoute();


}



export default productFunc