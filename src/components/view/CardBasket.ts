import { Card } from "./Card";
import { IProduct } from "../../types";

export class CardBasket extends Card<IProduct> {
  private _index: HTMLElement;
  private _deleteButton: HTMLButtonElement | null;
  private _onDelete: (id: string) => void;
  private _productId: string | null = null;

  constructor(container: HTMLElement, onDelete: (id: string) => void) {
    super(container);
    this._index = container.querySelector(".basket__item-index") as HTMLElement;
    this._deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement | null;
    this._onDelete = onDelete;

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        if (this._productId) {
          this._onDelete(this._productId);
        }
      });
    }
  }

  set data(value: IProduct & { index: number }) {
    this._productId = value.id;

    this.title = value.title;
    this.price = value.price;

    if (this._index) {
      this._index.textContent = String(value.index);
    }
  }
}
