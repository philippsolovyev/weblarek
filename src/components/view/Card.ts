import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

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
