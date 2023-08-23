const modalContainer = document.getElementById('modal-container');
const modalOverlay = document.getElementById('modal-overlay');

const cartBtn = document.getElementById("cart-btn");
const cartCounter = document.getElementById("cart-counter");


const displayCart = () => {
  modalContainer.innerHTML = "";
  modalContainer.style.display = 'block';
  modalOverlay.style.display = 'block';
  //modal Header
  const modalHeadder = document.createElement('div');

  const modalClose = document.createElement('div');
  modalClose.innerText = '❌';
  modalClose.className = "modal-close";
  modalHeadder.append(modalClose);

  modalClose.addEventListener('click', () => {
    modalContainer.style.display = 'none';
    modalOverlay.style.display = 'none';
  });

  const modalTitle = document.createElement('div');
  modalTitle.innerText = "Cart";
  modalTitle.className = "modal-title";
  modalHeadder.append(modalTitle);

  modalContainer.append(modalHeadder);

  //modal body
  if (cart.length > 0) {
    cart.forEach((product) => {
      const modalBody = document.createElement('div');
      modalBody.className = "modal-body";
      modalBody.innerHTML = `
          <div class="product">
            <img class="product-img" src="${product.img}"/>
            <div class="product-info">
              <h4>${product.name}</h4>
            </div>
          <div class="quantity">
            <span class="quantity-btn-decrese">➖</span>
            <span class="quantity-input">${product.quanty}</span>
            <span class="quantity-btn-increse">➕</span>
          </div>
            <div class="price">$ ${product.price * product.quanty}</div>
            <div class="delete-product">❌</div>
          </div>
          `;
      modalContainer.append(modalBody);

      // drecese quanty
      const decreseBtn = modalBody.querySelector(".quantity-btn-decrese")
      decreseBtn.addEventListener("click", () => {
        if (product.quanty !== 1) {
          product.quanty--;
          displayCart();
        }
        displayCartCounter();
      })


      // increse quanty

      const increseBtn = modalBody.querySelector(".quantity-btn-increse")
      increseBtn.addEventListener("click", () => {
        if (product.quanty !== 0) {
          product.quanty++;
          displayCart();
        }
        displayCartCounter();
      });

      //delete product
      const deleteBtn = modalBody.querySelector(".delete-product");
      deleteBtn.addEventListener("click", () => {
        deleteCartProduct(product.id);
      });
    });

    //modal footer
    const total = cart.reduce((acc, prod) => acc + prod.price * prod.quanty, 0);

    const modalFooter = document.createElement('div');
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
    <div class="total-price">Total: $${total}</div>
    <button class="btn-primary" id="checkout-btn">go to checkout</button>
    <div id="button-checkout"></div>
    `;
    modalContainer.append(modalFooter);

    //Mercado Pago
    const mercadoPago = new MercadoPago("TEST-4a7defa0-1d9a-4a12-b7f4-cb855a7e3789", {
      locale: "es-AR", //moneda a usar 
    });

    const checkoutButton = modalFooter.querySelector("#checkout-btn");

    checkoutButton.addEventListener("click", function () {
      checkoutButton.remove();

      const orderData = {
        quantity: 1,
        description: "compra de ecommerce",
        price: total,
      };


      fetch("http://localhost:8080/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (preference) {
          createCheckoutButton(preference.id);
        })
        .catch(function () {
          alert("Unexpected error");
        });
    });

    function createCheckoutButton(preferenceId) {
      // Initialize the checkout button
      const bricksBuilder = mercadoPago.bricks();
      const renderComponent = async (bricksBuilder) => {
        //if (window.checkoutButton) checkoutButton.unmount();

        await bricksBuilder.create(
          "wallet",
          "button-checkout", // class/id where the payment button will be displayed
          {
            initialization: {
              preferenceId: preferenceId,
            },
            callbacks: {
              onError: (error) => console.error(error),
              onReady: ()=>{},
            },
          }
        );
      };
      window.checkoutButton = renderComponent(bricksBuilder);
    }
  } else {
    const modalText = document.createElement("h2");
    modalText.className = "modal-body";
    modalText.innerText = "Your cart is empty!";
    modalContainer.append(modalText);
  }
};

cartBtn.addEventListener('click', displayCart);

const deleteCartProduct = (id) => {
  const foundId = cart.findIndex((el) => el.id === id);
  cart.splice(foundId, 1);
  displayCart();
  displayCartCounter();
};

const displayCartCounter = () => {
  const cartLength = cart.reduce((acc, prod) => acc + prod.quanty, 0);
  if (cartLength > 0) {
    cartCounter.style.display = "block";
    cartCounter.innerText = cartLength;
  } else {
    cartCounter.style.display = "none";
  }
}