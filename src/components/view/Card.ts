import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { categoryMap, CDN_URL } from "../../utils/constants";

// БАЗОВЫЙ КЛАСС ДЛЯ ВСЕХ КАРТОЧЕК

export abstract class Card<T extends IProduct> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = container.querySelector(".card__title") as HTMLElement;
    this._price = container.querySelector(".card__price") as HTMLElement;
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent =
        value === null ? "Бесценно" : `${value} синапсов`;
    }
  }
}

// КАРТОЧКА С ИЗОБРАЖЕНИЕМ (ПРОМЕЖУТОЧНЫЙ КЛАСС)

export abstract class CardWithImage<T extends IProduct> extends Card<T> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._image = container.querySelector(".card__image") as HTMLImageElement;
    this._category = container.querySelector(".card__category") as HTMLElement;
  }

  set category(value: string) {
    if (this._category) {
      const catName = value || "другое";
      const modClass =
        categoryMap[catName as keyof typeof categoryMap] ||
        "card__category_other";
      this._category.textContent = catName;
      this._category.className = `card__category ${modClass}`;
    }
  }

  set image(value: string) {
    if (this._image) {
      this._image.src = value ? `${CDN_URL}${value}` : "";
      this._image.alt = "Изображение товара";
    }
  }
}

// КАРТОЧКА ДЛЯ КАТАЛОГА

export class CardCatalog extends CardWithImage<IProduct> {
  protected _button: HTMLButtonElement | null;
  protected _product: IProduct | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement | null;

    // ОСНОВНОЙ КЛИК ПО КАРТОЧКЕ
    container.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".card__button")) {
        return;
      }
      if (this._product) {
        this.events.emit("card:select", this._product);
      }
    });
  }

  set data(product: IProduct) {
    this._product = product;
    this.title = product.title;
    this.price = product.price;
    this.category = product.category || "";
    this.image = product.image || "";

    if (this._button) {
      const newButton = this._button.cloneNode(true) as HTMLButtonElement;
      this._button.parentNode?.replaceChild(newButton, this._button);
      this._button = newButton;

      this._button.addEventListener("click", (e) => {
        e.stopPropagation();
        this.events.emit("card:buy", product);
      });
    }
  }
}

// КАРТОЧКА ДЛЯ ПРЕВЬЮ

export class CardPreview extends CardWithImage<IProduct> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement | null;
  private _buttonAction: (() => void) | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._description = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement | null;
  }

  set data(product: IProduct) {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category || "";
    this.image = product.image || "";
    if (this._description)
      this._description.textContent = product.description || "";
  }

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (this._button) this._button.disabled = value;
  }

  set buttonAction(action: (() => void) | null) {
    this._buttonAction = action;
    if (this._button) {
      const newButton = this._button.cloneNode(true) as HTMLButtonElement;
      this._button.parentNode?.replaceChild(newButton, this._button);
      this._button = newButton;
      this._button.addEventListener("click", () => {
        if (this._buttonAction) this._buttonAction();
      });
    }
  }
}

// КАРТОЧКА ДЛЯ КОРЗИНЫ

export class CardBasket extends Card<IProduct> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement | null;
  protected _productId: string | null = null;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement | null;
  }

  set data(value: IProduct & { index: number }) {
    this._productId = value.id;
    this.title = value.title;
    this.price = value.price;

    if (this._index) {
      this._index.textContent = String(value.index);
    }

    if (this._deleteButton) {
      const newButton = this._deleteButton.cloneNode(true) as HTMLButtonElement;
      this._deleteButton.parentNode?.replaceChild(
        newButton,
        this._deleteButton,
      );
      this._deleteButton = newButton;

      this._deleteButton.addEventListener("click", () => {
        this.events.emit("basket:remove", { id: this._productId });
      });
    }
  }
}
