import { CardWithImage } from "./Card";
import { IProduct } from "../../types";

export class CardCatalog extends CardWithImage<IProduct> {
  private _onClick: () => void;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this._onClick = onClick;

    container.addEventListener("click", () => {
      this._onClick();
    });
  }

  set data(product: IProduct) {
    this.title = product.title;
    this.price = product.price;
    this.category = product.category || "";
    this.image = product.image || "";
  }
}
