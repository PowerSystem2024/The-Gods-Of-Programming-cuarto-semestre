const shopContent = document.getElementById("shopContent");
const cartCount = document.getElementById("cart-count");

// Carrito
const cart = [];

// Mostrar productos
productos.forEach((product) => {
    const content = document.createElement("div");
    content.className = "card-product";
    content.innerHTML = `
        <img src="${product.img}">
        <h3>${product.productName}</h3>
        <p>$${product.price}</p>
    `;


    // Crear botón de compra
    const buyButton = document.createElement("button");
    buyButton.innerText = "Comprar";
    buyButton.className = "buy-button";

    // Event listener para el botón
    buyButton.addEventListener("click", () => {
        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quanty++;
        } else {
            cart.push({
                id: product.id,
                productName: product.productName,
                price: product.price,
                quanty: 1,
                img: product.img
            });
        }

        // Actualizar contador del carrito
        updateCartCount();
        console.log("Carrito actual:", cart);


    });

    content.append(buyButton);
    shopContent.append(content);
});

// Función para actualizar el contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((total, product) => total + product.quanty, 0);
    cartCount.textContent = totalItems;
}

// Hacer el carrito accesible desde la consola para debugging
window.miCarrito = cart;