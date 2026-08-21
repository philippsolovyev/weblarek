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
import { IOrder } from "./types";
import { ensureElement, cloneTemplate } from "./utils/utils";

// 1. СОЗДАЕМ ЭКЗЕМПЛЯРЫ ВСЕХ КЛАССОВ

const events = new EventEmitter();

const api = new Api(API_URL);
const appApi = new AppApi(api);

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// ====== КОМПОНЕНТЫ (View) ======

const header = new Header(ensureElement(".header"), events);
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(ensureElement(".modal"));
const basket = new Basket(cloneTemplate("#basket"), events);
const formOrder = new FormOrder(cloneTemplate("#order"), events);
const formContacts = new FormContacts(cloneTemplate("#contacts"), events);
const orderSuccess = new Success(cloneTemplate("#success"), events);

// 2. УТИЛИТЫ ДЛЯ РЕНДЕРИНГА

function renderGallery(): void {
  const products = productsModel.getItems();
  const cards = products.map((product) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), () => {
      const selected = productsModel.getItemById(product.id);
      if (selected) {
        productsModel.setSelectedItem(selected);
      }
    });
    card.data = product;
    return card.render();
  });
  gallery.catalog = cards;
}

function renderBasket(): void {
  const items = basketModel.getItems();
  const cards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), () => {
      basketModel.removeItem(item.id);
    });
    card.data = { ...item, index: index + 1 };
    return card.render();
  });
  basket.items = cards;
  basket.total = basketModel.getTotal();
  header.counter = basketModel.getCount();
}

function renderProductPreview(): void {
  const product = productsModel.getSelectedItem();
  if (!product) return;

  const inBasket = basketModel.isInBasket(product.id);

  const preview = new CardPreview(cloneTemplate("#card-preview"), () => {
    if (basketModel.isInBasket(product.id)) {
      basketModel.removeItem(product.id);
    } else {
      basketModel.addItem(product);
    }
    modal.close();
  });

  preview.data = product;

  if (product.price === null) {
    preview.buttonText = "Недоступно";
    preview.buttonDisabled = true;
  } else if (inBasket) {
    preview.buttonText = "Удалить из корзины";
    preview.buttonDisabled = false;
  } else {
    preview.buttonText = "Купить";
    preview.buttonDisabled = false;
  }

  modal.content = preview.render();
  modal.open();
}

function renderForms(): void {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  const orderErrors: Record<string, string> = {};
  if (errors.payment) orderErrors.payment = errors.payment;
  if (errors.address) orderErrors.address = errors.address;

  const contactsErrors: Record<string, string> = {};
  if (errors.email) contactsErrors.email = errors.email;
  if (errors.phone) contactsErrors.phone = errors.phone;

  formOrder.payment = data.payment;
  formOrder.address = data.address;
  formOrder.errors = orderErrors;
  formOrder.valid = !errors.payment && !errors.address;

  formContacts.email = data.email;
  formContacts.phone = data.phone;
  formContacts.errors = contactsErrors;
  formContacts.valid = !errors.email && !errors.phone;
}

// 3. ПОДПИСКА НА СОБЫТИЯ (ПРЕЗЕНТЕР)

events.on("products:loaded", () => {
  renderGallery();
});

events.on("product:selected", () => {
  renderProductPreview();
});

events.on("basket:changed", () => {
  renderBasket();
});

events.on("buyer:changed", () => {
  renderForms();
});

events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
});

events.on("basket:checkout", () => {
  modal.content = formOrder.render();
  modal.open();
});

events.on("order:payment", (data: { payment: string }) => {
  buyerModel.setData({ payment: data.payment as any });
});

events.on("order:address", (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
});

events.on("order:next", () => {
  modal.content = formContacts.render();
});

events.on("contacts:email", (data: { email: string }) => {
  buyerModel.setData({ email: data.email });
});

events.on("contacts:phone", (data: { phone: string }) => {
  buyerModel.setData({ phone: data.phone });
});

events.on("contacts:pay", () => {
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
      orderSuccess.total = response.total || order.total;
      modal.content = orderSuccess.render();
      modal.open();
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
      alert("Ошибка при оформлении заказа. Попробуйте снова.");
    });
});

events.on("success:close", () => {
  modal.close();
});

// 4. ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА

appApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((err) => {
    console.error("Ошибка загрузки товаров:", err);
    gallery.catalog = [];
  });
