import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    if (!this.isInBasket(item.id)) {
      this.items.push(item);
      this.events.emit("basket:changed", this.items);
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", this.items);
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed", this.items);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  isInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
