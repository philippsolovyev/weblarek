import { Component } from "../base/Component";

export class Modal extends Component<{ content: HTMLElement }> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._closeButton = container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;
    this._content = container.querySelector(".modal__content") as HTMLElement;

    if (this._closeButton) {
      this._closeButton.addEventListener("click", () => this.close());
    }

    container.addEventListener("click", (e) => {
      if (e.target === container) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    if (this._content) {
      this._content.replaceChildren(value);
    }
  }

  get isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }

  open() {
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "";
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this.content = data.content;
    this.open();
    return this.container;
  }
}
