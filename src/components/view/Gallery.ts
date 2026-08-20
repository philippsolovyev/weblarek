import { Component } from "../base/Component";

export class Gallery extends Component<HTMLElement[]> {
  private _container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._container = container;
  }

  set catalog(items: HTMLElement[]) {
    if (this._container) {
      this._container.replaceChildren(...items);
    }
  }
}
