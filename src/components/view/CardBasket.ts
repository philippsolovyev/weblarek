import { Card } from "./Card";
import { IProduct } from "../../types";

export class CardBasket extends Card<IProduct> {
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement | null;
  private _onDelete: () => void;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement | null;
    this._onDelete = onDelete;

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._onDelete();
      });
    }
  }

  set data(value: IProduct & { index: number }) {
    this.title = value.title;
    this.price = value.price;

    if (this._index) {
      this._index.textContent = String(value.index);
    }
  }
}
