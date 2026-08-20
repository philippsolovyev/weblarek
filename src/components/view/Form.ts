import { Component } from "../base/Component";

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement | null;
  protected _errors: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this._form = container as HTMLFormElement;
    this._submitButton = container.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement | null;
    this._errors = container.querySelector(
      ".form__errors",
    ) as HTMLElement | null;
  }

  protected _setErrors(
    value: Record<string, string>,
    hasInteracted: boolean,
  ): void {
    if (this._errors && hasInteracted) {
      const messages = Object.values(value).filter(Boolean);
      this._errors.textContent = messages.join(", ") || "";
    } else if (this._errors) {
      this._errors.textContent = "";
    }
  }

  set valid(value: boolean) {
    if (this._submitButton) {
      this._submitButton.disabled = !value;
    }
  }
}
