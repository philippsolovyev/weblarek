import './scss/styles.scss';

// ====== ИМПОРТЫ МОДЕЛЕЙ ======
import { ProductsModel } from './components/models/ProductsModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// ====== ИМПОРТ КОММУНИКАЦИОННОГО СЛОЯ ======
import { AppApi } from './components/communication/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// ====== ИМПОРТ ТЕСТОВЫХ ДАННЫХ ======
import { apiProducts } from './utils/data';


// 1. СОЗДАНИЕ ЭКЗЕМПЛЯРОВ КЛАССОВ


const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

// Композиция: создаем Api и передаем в AppApi
const api = new Api(API_URL);
const appApi = new AppApi(api);


// 2. ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ 


console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===');

// ----- ProductsModel -----
console.log('--- ProductsModel ---');

productsModel.setItems(apiProducts.items);
console.log('Каталог товаров:', productsModel.getItems());

const firstProduct = productsModel.getItemById(apiProducts.items[0].id);
console.log('Первый товар по id:', firstProduct);

productsModel.setSelectedItem(firstProduct || null);
console.log('Выбранный товар:', productsModel.getSelectedItem());

// ----- BasketModel -----
console.log('--- BasketModel ---');

const testProduct = apiProducts.items[0];
console.log('Корзина до добавления:', basketModel.getItems());

basketModel.addItem(testProduct);
console.log('После добавления:', basketModel.getItems());

console.log('Стоимость корзины:', basketModel.getTotal());
console.log('Количество товаров:', basketModel.getCount());
console.log('Проверка наличия товара:', basketModel.isInBasket(testProduct.id));

basketModel.removeItem(testProduct.id);
console.log('После удаления:', basketModel.getItems());

// ----- BuyerModel -----
console.log('--- BuyerModel ---');

console.log('Данные покупателя (пустые):', buyerModel.getData());

buyerModel.setData({ email: 'test@mail.ru', phone: '+79991234567', address: 'ул. Пушкина, д.1' });
console.log('После обновления:', buyerModel.getData());

console.log('Проверка заполненности:', buyerModel.isComplete());

const errors = buyerModel.validate();
console.log('Ошибки валидации:', errors);


// 3. ЗАПРОС К СЕРВЕРУ


console.log('=== ЗАПРОС К СЕРВЕРУ ===');

appApi.getProducts()
    .then((response) => {
        console.log('Данные с сервера:', response);
        
        // Сохраняем массив товаров в модель
        productsModel.setItems(response.items);
        console.log('Каталог сохранен в модель (с сервера):', productsModel.getItems());

        // ====== ОТОБРАЖЕНИЕ НА СТРАНИЦЕ ======
        const app = document.querySelector('#app');
        if (app) {
            app.innerHTML = `
                <h1>Веб-Ларёк</h1>
                <p>Проект запущен!</p>
                <p>Товаров в каталоге: ${productsModel.getItems().length}</p>
                <p>Названия товаров:</p>
                <ul>
                    ${productsModel.getItems().map(p => `<li>${p.title}</li>`).join('')}
                </ul>
                <p style="color: #666; font-size: 14px;">Открой консоль (F12) для просмотра логов</p>
            `;
        }
    })
    .catch((error) => {
        console.error('Ошибка при получении данных с сервера:', error);

        // ====== ПОКАЗЫВАЕМ ОШИБКУ ======
        const app = document.querySelector('#app');
        if (app) {
            app.innerHTML = `
                <h1>Веб-Ларёк</h1>
                <p style="color: red;">Ошибка загрузки данных: ${error.message}</p>
                <p>Проверь подключение к интернету и настройки .env</p>
            `;
        }
    });

// ====== ПЕРВОНАЧАЛЬНАЯ ЗАГЛУШКА (до загрузки) ======
const app = document.querySelector('#app');
if (app && !app.innerHTML) {
    app.innerHTML = `
        <h1>Веб-Ларёк</h1>
        <p>Загрузка данных...</p>
        <p>Открой консоль (F12) для просмотра логов</p>
    `;
}