import { Form } from "./Form";
import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class FormContacts extends Form<Partial<IBuyer>> {
  private _emailInput: HTMLInputElement | null;
  private _phoneInput: HTMLInputElement | null;
  private _hasInteracted: boolean = false;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._emailInput = container.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement | null;
    this._phoneInput = container.querySelector(
      'input[name="phone"]',
    ) as HTMLInputElement | null;

    if (this._errors) {
      this._errors.textContent = "";
    }

    if (this._emailInput) {
      this._emailInput.addEventListener("input", () => {
        this._hasInteracted = true;
        this.events.emit("contacts:email", {
          email: this._emailInput?.value || "",
        });
      });
    }

    if (this._phoneInput) {
      this._phoneInput.addEventListener("input", () => {
        this._hasInteracted = true;
        this.events.emit("contacts:phone", {
          phone: this._phoneInput?.value || "",
        });
      });
    }

    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._hasInteracted = true;
      this.events.emit("contacts:pay");
    });
  }

  set email(value: string | null) {
    if (this._emailInput) {
      this._emailInput.value = value || "";
    }
  }

  set phone(value: string | null) {
    if (this._phoneInput) {
      this._phoneInput.value = value || "";
    }
  }

  set errors(value: Record<string, string>) {
    this._setErrors(value, this._hasInteracted);
  }
}
