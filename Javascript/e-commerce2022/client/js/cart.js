// Declaración de variables para Mercado Pago y elementos nuevos
const checkoutButton = document.querySelector("#button-checkout");

// Función para mostrar el contador de productos
const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    if (cartCount) {
        if (cartLength > 0) {
            cartCount.style.display = "block";
            cartCount.innerText = cartLength;
        } else {
            cartCount.style.display = "none";
        }
    }
};
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

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";

    if (cart.length > 0) {
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
            const deleteProduct = productDiv.querySelector(".delete-product");
            deleteProduct.addEventListener("click", ()=>{
                cart.splice(idx, 1);
                displayCart();
            });
            modalBody.append(productDiv);
        });
        modalContainer.append(modalBody);
        const total = cart.reduce((acc, el)=> acc + el.price * el.quanty, 0);
        const modalFooter = document.createElement("div");
        modalFooter.className = "modalFooter";
                modalFooter.innerHTML = `
                    <div class="total-price">Total: ${total} :)</div>
                    <button id="checkout-btn" class="checkout-btn">Ir al checkout</button>
                `;
                // Agregar el div para el Brick de Mercado Pago
                const buttonCheckout = document.createElement("div");
                buttonCheckout.id = "button-checkout";
                modalFooter.appendChild(buttonCheckout);
                modalContainer.append(modalFooter);
    } else {
        const modalText = document.createElement("div");
        modalText.innerText = "Your cart is empty";
        modalBody.appendChild(modalText);
        modalContainer.append(modalBody);
        const modalFooter = document.createElement("div");
        modalFooter.className = "modalFooter";
        modalFooter.innerHTML = '';
        modalContainer.append(modalFooter);
    }
    displayCartCounter();
};
// Lógica para el checkout y Mercado Pago
const createCheckoutButton = (preferenceId) => {
    // Ocultar el botón de checkout y mostrar loader
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    const buttonCheckout = document.getElementById('button-checkout');
    if (buttonCheckout) {
        buttonCheckout.innerHTML = '<div class="loader-mp" style="display:flex;justify-content:center;align-items:center;height:48px;"><span style="padding:8px 16px;border-radius:8px;background:#eee;color:#660000;font-weight:bold;box-shadow:0 2px 8px rgba(42,0,0,0.10);font-size:1rem;">Cargando pago...</span></div>';
    }
    const mercadopago = new window.MercadoPago('TEST-7d3c639a-36f0-4207-9c66-1a405002ee49');
    const bricksBuilder = mercadopago.bricks();
    bricksBuilder.create("wallet", "button-checkout", {
        initialization: {
            preferenceId: preferenceId,
        },
        onReady: () => {
            // Cuando el Brick esté listo, ocultar el loader
            if (buttonCheckout) buttonCheckout.innerHTML = '';
        }
    });
};

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'checkout-btn') {
        const orderData = {
            items: cart.map(item => ({
                title: item.productName,
                unit_price: item.price,
                quantity: item.quanty
            })),
            description: "Compra de E-commerce",
            price: cart.reduce((acc, el) => acc + el.price * el.quanty, 0)
        };
    fetch("https://the-gods-of-programming-cuarto-semestre.onrender.com/create_preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
        })
        .then(response => response.json())
        .then(preference => {
            createCheckoutButton(preference.id);
        })
        .catch(error => {
            alert("Error al crear la preferencia de pago.");
            console.error(error);
        });
    }
});

cartBtn.addEventListener("click", displayCart);

const deleteCardProduct =(id)=> {
    const foundId = cart.findIndex((element)=> element.id === id);
    console.log(foundId);
    cart.splice(foundId, 1);
    displayCart()
};