const modalContainer = document.getElementById("modal-container");
const modalOverlay = document.getElementById("modal-overlay");

const cartBtn = document.getElementById("cart-btn");




const displayCart = () => {

    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    //modal header
    const modalHeader = document.createElement("div");

    const modalCLose = document.createElement("div");
    modalCLose.innerText = "❌";
    modalCLose.className = "modal-close";
    modalHeader.append(modalCLose);

    modalCLose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Carrito";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);


};

cartBtn.addEventListener("click", displayCart);