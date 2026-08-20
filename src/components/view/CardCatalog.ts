import { CardWithImage } from "./Card";
import { IProduct } from "../../types";

export class CardCatalog extends CardWithImage<IProduct> {
  private _button: HTMLButtonElement | null;
  private _onClick: (product: IProduct) => void;
  private _onBuy: (product: IProduct) => void;
  private _product: IProduct | null = null;

  constructor(
    container: HTMLElement,
    onClick: (product: IProduct) => void,
    onBuy: (product: IProduct) => void,
  ) {
    super(container);
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement | null;
    this._onClick = onClick;
    this._onBuy = onBuy;

    container.addEventListener("click", () => {
      if (this._product) {
        this._onClick(this._product);
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
        this._onBuy(product);
      });
    }
  }
}
