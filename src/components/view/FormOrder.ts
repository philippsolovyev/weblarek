import { Form } from "./Form";
import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class FormOrder extends Form<Partial<IBuyer>> {
  private _addressInput: HTMLInputElement | null;
  private _cardButton: HTMLButtonElement | null;
  private _cashButton: HTMLButtonElement | null;
  private _hasInteracted: boolean = false;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._addressInput = container.querySelector(
      'input[name="address"]',
    ) as HTMLInputElement | null;
    this._cardButton = container.querySelector(
      'button[name="card"]',
    ) as HTMLButtonElement | null;
    this._cashButton = container.querySelector(
      'button[name="cash"]',
    ) as HTMLButtonElement | null;

    if (this._errors) {
      this._errors.textContent = "";
    }

    if (this._cardButton) {
      this._cardButton.addEventListener("click", () => {
        this._hasInteracted = true;
        this.events.emit("order:payment", { payment: "card" });
      });
    }

    if (this._cashButton) {
      this._cashButton.addEventListener("click", () => {
        this._hasInteracted = true;
        this.events.emit("order:payment", { payment: "cash" });
      });
    }

    if (this._addressInput) {
      this._addressInput.addEventListener("input", () => {
        this._hasInteracted = true;
        this.events.emit("order:address", {
          address: this._addressInput?.value || "",
        });
      });
    }

    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._hasInteracted = true;
      this.events.emit("order:next");
    });
  }

  set payment(value: string | null) {
    if (this._cardButton && this._cashButton) {
      this._cardButton.classList.remove("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");

      if (value === "card") {
        this._cardButton.classList.add("button_alt-active");
      } else if (value === "cash") {
        this._cashButton.classList.add("button_alt-active");
      }
    }
  }

  set address(value: string | null) {
    if (this._addressInput) {
      this._addressInput.value = value || "";
    }
  }

  set errors(value: Record<string, string>) {
    this._setErrors(value, this._hasInteracted);
  }
}
