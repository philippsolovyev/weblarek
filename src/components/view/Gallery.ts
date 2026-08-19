import { Component } from "../base/Component";

export class Gallery extends Component<HTMLElement[]> {
  private _container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._container = container;
  }

  set catalog(items: HTMLElement[]) {
    if (this._container) {
      if (!items || items.length === 0) {
        this._container.innerHTML =
          '<p style="text-align:center;padding:40px;color:#999;">Товары не загружены</p>';
      } else {
        this._container.replaceChildren(...items);
      }
    }
  }
}
