const products = [
    {
        name: "Электрогитара Fender",
        imageUrl: "https://avatars.mds.yandex.net/i?id=2ea92c89e34364c45bad8be4affa6d45e7dd7b52-4352956-images-thumbs&n=13",
        price: 54999,
        category: "Гитары"
    },
    {
        name: "Бас-гитара Ibanez",
        imageUrl: "https://avatars.mds.yandex.net/i?id=22d59e8308b4f962b89b7591a01fba35b37cb9e4-5236341-images-thumbs&n=13",
        price: 34599,
        category: "Бас-гитары"
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
    priceElement.textContent = `Цена: ${product.price} руб.`;

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

// Пример запроса к базе данных (получение списка товаров)
pool.query('SELECT  FROM товары', (err, res) => {
  if (err) {
    console.error('Ошибка при запросе к базе данных:', err);
  } else {
    console.log('Товары:', res.rows);
    // Обработка полученных данных 
  }
});