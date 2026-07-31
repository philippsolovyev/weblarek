import { IBuyer, TPayment, TErrors } from "../../types";

export class BuyerModel implements IBuyer {
  private _payment: TPayment | null = null;
  private _email: string = "";
  private _phone: string = "";
  private _address: string = "";

  // Геттеры для доступа к полям (если понадобятся)
  get payment(): TPayment | null {
    return this._payment;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = "";
    this._phone = "";
    this._address = "";
  }

  validate(): TErrors<IBuyer> {
    const errors: TErrors<IBuyer> = {};

    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._email) {
      errors.email = "Укажите email";
    }
    if (!this._phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this._address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }

  isComplete(): boolean {
    return !!this._payment && !!this._email && !!this._phone && !!this._address;
  }
}
