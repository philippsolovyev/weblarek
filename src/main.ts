import "./scss/styles.scss";

// ====== ИМПОРТЫ ======
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";

import { ProductsModel } from "./components/models/ProductsModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { AppApi } from "./components/communication/AppApi";

import {
  Header,
  Gallery,
  Basket,
  Modal,
  Success,
  FormOrder,
  FormContacts,
  CardCatalog,
  CardPreview,
  CardBasket,
} from "./components/view";

import { API_URL } from "./utils/constants";
import { IProduct, IOrder } from "./types";
import { ensureElement, cloneTemplate } from "./utils/utils";

// 1. СОЗДАЕМ ЭКЗЕМПЛЯРЫ ВСЕХ КЛАССОВ

const events = new EventEmitter();

const productsModel = new ProductsModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const appApi = new AppApi(api);

// ====== КОМПОНЕНТЫ (View) ======

const header = new Header(ensureElement(".header"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(ensureElement(".modal"), events);

const basket = new Basket(cloneTemplate("#basket"), events);
const formOrder = new FormOrder(cloneTemplate("#order"), events);
const formContacts = new FormContacts(cloneTemplate("#contacts"), events);
const orderSuccess = new Success(cloneTemplate("#success"), events);

// 2. УТИЛИТЫ ДЛЯ РЕНДЕРИНГА

function renderGallery(): void {
  const products = productsModel.getItems();
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), events);
    card.data = product;
    return card.render();
  });
  gallery.catalog = cards;
}

function renderBasket(): void {
  const items = basketModel.getItems();
  const total = basketModel.getTotal();

  if (items.length === 0) {
    basket.items = [];
    basket.total = 0;
    return;
  }

  const cards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), events);
    card.data = { ...item, index: index + 1 };
    return card.render();
  });

  basket.items = cards;
  basket.total = total;
}

function renderProductPreview(product: IProduct): void {
  const inBasket = basketModel.isInBasket(product.id);
  const preview = new CardPreview(cloneTemplate("#card-preview"), events);

  preview.data = product;

  if (product.price === null) {
    preview.buttonText = "Недоступно";
    preview.buttonDisabled = true;
    preview.buttonAction = null;
  } else if (inBasket) {
    preview.buttonText = "Удалить из корзины";
    preview.buttonDisabled = false;
    preview.buttonAction = () => {
      basketModel.removeItem(product.id);
      events.emit("basket:changed");
      modal.close();
    };
  } else {
    preview.buttonText = "Купить";
    preview.buttonDisabled = false;
    preview.buttonAction = () => {
      basketModel.addItem(product);
      events.emit("basket:changed");
      modal.close();
    };
  }

  modal.content = preview.render();
  modal.open();
}

function renderFormOrder(): void {
  const data = buyerModel.getData();
  const errors = buyerModel.validateStep(1);

  formOrder.payment = data.payment;
  formOrder.address = data.address;
  formOrder.errors = errors;
  formOrder.valid = buyerModel.isStepComplete(1);
}

function renderFormContacts(): void {
  const data = buyerModel.getData();
  const errors = buyerModel.validateStep(2);

  formContacts.email = data.email;
  formContacts.phone = data.phone;
  formContacts.errors = errors;
  formContacts.valid = buyerModel.isStepComplete(2);
}

// 3. ПОДПИСКА НА СОБЫТИЯ (Presenter)

// ----- Загрузка товаров -----
appApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    events.emit("products:loaded");
  })
  .catch((err) => console.error("Ошибка загрузки товаров:", err));

// ----- Товары загружены - отрисовка каталога -----
events.on("products:loaded", () => {
  renderGallery();
});

// ----- Выбор карточки - открыть модалку -----
events.on("card:select", (product: IProduct) => {
  if (product) {
    renderProductPreview(product);
  }
});

// ----- Корзина изменилась -----
events.on("basket:changed", () => {
  const count = basketModel.getCount();
  header.counter = count;
  renderBasket();
});

// ----- Открытие корзины -----
events.on("basket:open", () => {
  renderBasket();
  modal.content = basket.render();
  modal.open();
});

// ----- Удаление товара из корзины -----
events.on("basket:remove", (data: { id: string }) => {
  if (data && data.id) {
    basketModel.removeItem(data.id);
    events.emit("basket:changed");
  }
});

// ----- Оформление заказа -----
events.on("basket:checkout", () => {
  if (basketModel.getCount() === 0) return;
  formOrder.reset();
  renderFormOrder();
  modal.content = formOrder.render();
  modal.open();
});

// ----- Форма заказа: выбор оплаты -----
events.on("order:payment", (data: { payment: string }) => {
  buyerModel.setData({ payment: data.payment as any });
  renderFormOrder();
});

// ----- Форма заказа: ввод адреса -----
events.on("order:address", (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
  renderFormOrder();
});

// ----- Форма заказа: кнопка "Далее" -----
events.on("order:next", () => {
  formOrder.showErrors();
  const errors = buyerModel.validateStep(1);
  const hasErrors = Object.values(errors).some(
    (e) => e !== undefined && e !== "",
  );

  if (!hasErrors && buyerModel.isStepComplete(1)) {
    formContacts.reset();
    renderFormContacts();
    modal.content = formContacts.render();
  } else {
    formOrder.errors = errors;
  }
});

// ----- Форма контактов: email -----
events.on("contacts:email", (data: { email: string }) => {
  buyerModel.setData({ email: data.email });
  renderFormContacts();
});

// ----- Форма контактов: телефон -----
events.on("contacts:phone", (data: { phone: string }) => {
  buyerModel.setData({ phone: data.phone });
  renderFormContacts();
});

// ----- Форма контактов: кнопка "Оплатить" -----
events.on("contacts:pay", () => {
  formContacts.showErrors();
  const errors = buyerModel.validateStep(2);
  const hasErrors = Object.values(errors).some(
    (e) => e !== undefined && e !== "",
  );

  if (hasErrors) {
    formContacts.errors = errors;
    return;
  }

  if (!buyerModel.isComplete()) {
    return;
  }

  const orderData = buyerModel.getData();
  const items = basketModel.getItems();

  const order: IOrder = {
    payment: orderData.payment!,
    email: orderData.email!,
    phone: orderData.phone!,
    address: orderData.address!,
    total: basketModel.getTotal(),
    items: items.map((i) => i.id),
  };

  appApi
    .postOrder(order)
    .then((response) => {
      basketModel.clear();
      buyerModel.clear();
      events.emit("basket:changed");
      orderSuccess.total = response.total || order.total;
      modal.content = orderSuccess.render();
      modal.open();
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
      alert("Ошибка при оформлении заказа. Попробуйте снова.");
    });
});

// ----- Закрытие модалки с успехом -----
events.on("success:close", () => {
  modal.close();
});

// ----- Закрытие модалки -----
events.on("modal:close", () => {
  formOrder.reset();
  formContacts.reset();
});

// 4. ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА

appApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    events.emit("products:loaded");
  })
  .catch((err) => {
    console.error("Ошибка загрузки товаров:", err);
    gallery.catalog = [];
  });
