import { CardWithImage } from "./Card";
import { IProduct } from "../../types";

export class CardPreview extends CardWithImage<IProduct> {
  private _description: HTMLElement;
  private _button: HTMLButtonElement | null;
  private _onClick: () => void;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this._description = container.querySelector(".card__text") as HTMLElement;
    this._button = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement | null;
    this._onClick = onClick;

    if (this._button) {
      this._button.addEventListener("click", () => {
        this._onClick();
      });
    }
  }

  set data(product: IProduct) {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category || "";
    this.image = product.image || "";
    if (this._description) {
      this._description.textContent = product.description || "";
    }
  }

  set buttonText(value: string) {
    if (this._button) this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (this._button) this._button.disabled = value;
  }
}
