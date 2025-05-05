const products = [
    {
        name: "Вклады | Ставка от 24% годовых",
        imageUrl: "https://www.finam.ru/Images/u/newsonline/scheduledNews/202012/80.jpg",
    },
    {
        name: "Кредиты | Ставка от 12% годовых",
        imageUrl: "https://avatars.mds.yandex.net/i?id=055a1f158eeeeab760c65e95dde20f0b7f12a04e-4669930-images-thumbs&n=13",
        text: "",
    },
    // ...
];

// Функция для создания HTML-элемента товара
function createProductElement(product) {
    const productElement = document.createElement("div");
    productElement.classList.add("product");

    const imageElement = document.createElement("img");
    imageElement.src = product.imageUrl;
    imageElement.alt = product.name;

    const nameElement = document.createElement("h3");
    nameElement.textContent = product.name;

    const priceElement = document.createElement("p");
    priceElement.textContent = ``;

    productElement.appendChild(imageElement);
    productElement.appendChild(nameElement);
    productElement.appendChild(priceElement);

    return productElement;
}

// Отрисовка товаров на странице
const productContainer = document.querySelector(".product-container");
products.forEach(product => {
    productContainer.appendChild(createProductElement(product));
});
const { Pool } = require('pg'); // Установите pg с помощью npm install pg

// Настройки подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '1234',
  port: 5432, // Порт по умолчанию для PostgreSQL
});
