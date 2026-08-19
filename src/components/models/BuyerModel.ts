import { IBuyer, TPayment, TErrors } from "../../types";

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _email: string = "";
  private _phone: string = "";
  private _address: string = "";

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

  // Валидация по шагам (только заполненность)
  validateStep(step: 1 | 2): TErrors<IBuyer> {
    const errors: TErrors<IBuyer> = {};

    if (step === 1) {
      if (!this._payment) {
        errors.payment = "Не выбран вид оплаты";
      }
      if (!this._address) {
        errors.address = "Укажите адрес доставки";
      }
    } else if (step === 2) {
      if (!this._email) {
        errors.email = "Укажите email";
      }
      if (!this._phone) {
        errors.phone = "Укажите телефон";
      }
    }

    return errors;
  }

  // Проверка заполненности для конкретного шага
  isStepComplete(step: 1 | 2): boolean {
    if (step === 1) {
      return !!this._payment && !!this._address;
    } else if (step === 2) {
      return !!this._email && !!this._phone;
    }
    return false;
  }

  // Полная проверка (все поля) - для отправки заказа
  isComplete(): boolean {
    return !!this._payment && !!this._email && !!this._phone && !!this._address;
  }
}
