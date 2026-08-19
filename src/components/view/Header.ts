import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  private _counterElement: HTMLElement;
  private _basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._counterElement = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this._basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;

    if (this._basketButton) {
      this._basketButton.addEventListener("click", () => {
        this.events.emit("basket:open");
      });
    }
  }

  set counter(value: number) {
    if (this._counterElement) {
      this._counterElement.textContent = String(value);
    }
  }
}
