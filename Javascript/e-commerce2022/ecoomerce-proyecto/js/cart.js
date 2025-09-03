const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");
const cartBtn = document.getElementById("cart-btn");

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // modal header
    const modalHeader = document.createElement("div");

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Carrito";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    // modal body (un solo bloque)
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";

    cart.forEach((product, idx) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img class="product-img" src="${product.img}" />
            <div class="product-info">
                <h4>${product.productName}</h4>
            </div>
            <div class="quanty">
                <span class="quantity-btn-decrease">-</span>
                <span class="quantity-input">${product.quanty}</span>
                <span class="quantity-btn-increase">+</span>
            </div>
            <div class="price">${product.price * product.quanty} $</div>
            <div class="delete-product">❌</div>
        `;

        // Eventos para cada producto
        const decrease = productDiv.querySelector(".quantity-btn-decrease");
        decrease.addEventListener("click", ()=>{
            if(product.quanty !== 1 ){
                product.quanty--;
                displayCart();
            }
        });

        const increase = productDiv.querySelector(".quantity-btn-increase");
        increase.addEventListener("click",()=>{
            product.quanty++;
            displayCart();
        });

        //delete
        const deleteProduct = productDiv.querySelector(".delete-product");
        deleteProduct.addEventListener("click", ()=>{
            cart.splice(idx, 1);
            displayCart();
        });

        modalBody.append(productDiv);
    });

    modalContainer.append(modalBody);

    // modal footer

const total = cart.reduce((acc, el)=> acc + el.price * el.quanty, 0)   
const modalFooter = document.createElement("div");
modalFooter.className = "modalFooter";
modalFooter.innerHTML = `
  <div class="total-price">Total: ${total} :)</div>
`;

modalContainer.append(modalFooter);
};

cartBtn.addEventListener("click", displayCart);

const deleteCardProduct =(id)=> {
    const foundId = cart.findIndex((element)=> element.id === id);
    console.log(foundId);
    cart.splice(foundId, 1);
    displayCart()
};