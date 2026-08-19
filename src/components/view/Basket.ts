import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[], total: number }> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLButtonElement | null;
    private _emptyMessage: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement | null;

        this._emptyMessage = document.createElement('p');
        this._emptyMessage.textContent = 'Корзина пуста';
        this._emptyMessage.style.textAlign = 'center';
        this._emptyMessage.style.padding = '20px';
        this._emptyMessage.style.color = '#999';

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:checkout');
            });
        }
    }

    set items(value: HTMLElement[]) {
        if (this._list) {
            if (!value || value.length === 0) {
                this._list.replaceChildren(this._emptyMessage);
            } else {
                this._list.replaceChildren(...value);
            }
        }
        this._updateButtonState(value?.length > 0);
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `${value} синапсов`;
        }
    }

    private _updateButtonState(hasItems: boolean) {
        if (this._button) {
            this._button.disabled = !hasItems;
        }
    }
}