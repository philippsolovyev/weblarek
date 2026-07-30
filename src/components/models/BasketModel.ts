import { IProduct } from '../../types';

export class BasketModel {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.isInBasket(item.id)) {
            this.items.push(item);
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clear(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    isInBasket(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}