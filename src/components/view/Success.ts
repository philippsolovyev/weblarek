import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Success extends Component<{ total: number }> {
  private _total: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._total = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this._button = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    if (this._button) {
      this._button.addEventListener("click", () => {
        this.events.emit("success:close");
      });
    }
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `Списано ${value} синапсов`;
    }
  }
}
