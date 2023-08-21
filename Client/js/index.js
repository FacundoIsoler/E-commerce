const shopContent = document.getElementById("shop");
const cart = [];

products.forEach((product) => {
    const content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
    <img src="${product.img}"/>
    <h3>${product.name}</h3>
    <p class="price">$ ${product.price}</p>
    `;
    shopContent.append(content);

    const buyButton = document.createElement("button");
    buyButton.innerText = "Buy";

    content.append(buyButton);

    buyButton.addEventListener("click", () => {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quanty: product.quanty,
            img: product.img,
        });
        // console.log(cart);
    });
});