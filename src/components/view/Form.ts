import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBuyer } from "../../types";

// БАЗОВЫЙ КЛАСС ДЛЯ ВСЕХ ФОРМ

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

  set errors(value: Record<string, string>) {
    if (this._errors) {
      const messages = Object.values(value).filter(Boolean);
      this._errors.textContent = messages.join(", ") || "";
    }
  }

  set valid(value: boolean) {
    if (this._submitButton) {
      this._submitButton.disabled = !value;
    }
  }
}

// ФОРМА ЗАКАЗА (ОПЛАТА + АДРЕС)

export class FormOrder extends Form<Partial<IBuyer>> {
  private _addressInput: HTMLInputElement | null;
  private _cardButton: HTMLButtonElement | null;
  private _cashButton: HTMLButtonElement | null;
  private _hasAttemptedSubmit: boolean = false;

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
        this._hasAttemptedSubmit = true;
        this.events.emit("order:payment", { payment: "card" });
      });
    }

    if (this._cashButton) {
      this._cashButton.addEventListener("click", () => {
        this._hasAttemptedSubmit = true;
        this.events.emit("order:payment", { payment: "cash" });
      });
    }

    if (this._addressInput) {
      this._addressInput.addEventListener("input", () => {
        this._hasAttemptedSubmit = true;
        this.events.emit("order:address", {
          address: this._addressInput?.value || "",
        });
      });
    }

    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._hasAttemptedSubmit = true;
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

  override set errors(value: Record<string, string>) {
    if (this._errors && this._hasAttemptedSubmit) {
      const messages = Object.values(value).filter(Boolean);
      this._errors.textContent = messages.join(", ") || "";
    } else if (this._errors) {
      this._errors.textContent = "";
    }
  }

  showErrors() {
    this._hasAttemptedSubmit = true;
  }

  reset() {
    this._hasAttemptedSubmit = false;
    if (this._errors) {
      this._errors.textContent = "";
    }
  }
}

// ФОРМА КОНТАКТОВ (EMAIL + ТЕЛЕФОН)

export class FormContacts extends Form<Partial<IBuyer>> {
  private _emailInput: HTMLInputElement | null;
  private _phoneInput: HTMLInputElement | null;
  private _hasAttemptedSubmit: boolean = false;

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
        this._hasAttemptedSubmit = true;
        this.events.emit("contacts:email", {
          email: this._emailInput?.value || "",
        });
      });
    }

    if (this._phoneInput) {
      this._phoneInput.addEventListener("input", () => {
        this._hasAttemptedSubmit = true;
        this.events.emit("contacts:phone", {
          phone: this._phoneInput?.value || "",
        });
      });
    }

    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._hasAttemptedSubmit = true;
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

  override set errors(value: Record<string, string>) {
    if (this._errors && this._hasAttemptedSubmit) {
      const messages = Object.values(value).filter(Boolean);
      this._errors.textContent = messages.join(", ") || "";
    } else if (this._errors) {
      this._errors.textContent = "";
    }
  }

  showErrors() {
    this._hasAttemptedSubmit = true;
  }

  reset() {
    this._hasAttemptedSubmit = false;
    if (this._errors) {
      this._errors.textContent = "";
    }
  }
}
