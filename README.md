https://github.com/philippsolovyev/weblarek
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В приложении используются две основные сущности: **Товар** и **Покупатель**.

### Интерфейс товара (`IProduct`)

Описывает структуру данных товара, получаемых с сервера.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | Уникальный идентификатор товара |
| `title` | `string` | Название товара |
| `image` | `string` | URL изображения товара |
| `category` | `string` | Категория товара |
| `price` | `number \| null` | Цена товара. `null` — товар недоступен |
| `description` | `string` | Описание товара |

### Интерфейс покупателя (`IBuyer`)

Описывает данные, которые пользователь вводит при оформлении заказа.

| Поле | Тип | Описание |
|------|-----|----------|
| `payment` | `TPayment \| null` | Способ оплаты: `'card'` или `'cash'` |
| `email` | `string` | Email покупателя |
| `phone` | `string` | Номер телефона покупателя |
| `address` | `string` | Адрес доставки |

### Типы для заказа

#### `TPayment`
`type TPayment = 'card' | 'cash';`

#### `IOrder` — отправка заказа на сервер

| Поле | Тип | Описание |
|------|-----|----------|
| `payment` | `TPayment` | Способ оплаты |
| `email` | `string` | Email покупателя |
| `phone` | `string` | Телефон покупателя |
| `address`   | `string` | Адрес доставки |
| `total`     | `number` | Общая стоимость заказа |
| `items`     | `string[]` | Массив ID выбранных товаров |

#### `IOrderResponse` — ответ сервера на заказ

| Поле | Тип | Описание |
|------|-----|----------|
| `id`   | `string`  | ID заказа |
| `total` | `number`  | Общая стоимость заказа |

#### `IProductsResponse` — ответ сервера с каталогом

| Поле | Тип | Описание |
|------|-----|----------|
| `items` | `IProduct[]`| Массив товаров |
| `total` | `number` | Общее количество товаров |

## Модели данных

Модели данных отвечают за **хранение** и **управление** данными в приложении. Они не содержат логики отображения и не зависят от других классов.

### Класс `ProductsModel`

Отвечает за хранение каталога товаров и управление выбранным товаром.

**Конструктор:**  
`constructor()` — не принимает параметров.

**Поля класса:**  
- `private items: IProduct[]` — массив всех товаров из каталога.
- `private selectedItem: IProduct | null` — товар, выбранный для просмотра в модальном окне.

**Методы класса:**  
- `setItems(items: IProduct[]): void` — сохраняет массив товаров.
- `getItems(): IProduct[]` — возвращает массив всех товаров.
- `getItemById(id: string): IProduct | undefined` — возвращает товар по его `id`.
- `setSelectedItem(item: IProduct | null): void` — сохраняет выбранный товар.
- `getSelectedItem(): IProduct | null` — возвращает выбранный товар.

### Класс `BasketModel`

Отвечает за хранение товаров, добавленных пользователем в корзину.

**Конструктор:**  
`constructor()` — не принимает параметров.

**Поля класса:**  
- `private items: IProduct[]` — массив товаров в корзине.

**Методы класса:**  
- `getItems(): IProduct[]` — возвращает массив товаров в корзине.
- `addItem(item: IProduct): void` — добавляет товар в корзину (если его там еще нет).
- `removeItem(id: string): void` — удаляет товар из корзины по `id`.
- `clear(): void` — очищает корзину.
- `getTotal(): number` — возвращает общую стоимость всех товаров в корзине.
- `getCount(): number` — возвращает количество товаров в корзине.
- `isInBasket(id: string): boolean` — проверяет, находится ли товар с данным `id` в корзине.

### Класс `BuyerModel`

Отвечает за хранение данных покупателя, введенных при оформлении заказа.

**Конструктор:**  
`constructor()` — не принимает параметров.

**Поля класса:**  
- `payment: TPayment | null` — выбранный способ оплаты.
- `email: string` — email покупателя.
- `phone: string` — телефон покупателя.
- `address: string` — адрес доставки.

**Методы класса:**  
- `setData(data: Partial<IBuyer>): void` — сохраняет данные покупателя (частично или полностью).
- `getData(): IBuyer` — возвращает все данные покупателя.
- `clear(): void` — очищает все данные покупателя.
- `validate(): Partial<Record<keyof IBuyer, string>>` — проверяет валидность данных. Возвращает объект с ошибками для каждого поля.
- `isComplete(): boolean` — проверяет, заполнены ли все обязательные поля.

## Слой коммуникации

Слой коммуникации отвечает за взаимодействие с сервером.

### Класс `AppApi`

Наследуется от базового класса `Api` и реализует специфические методы для работы с сервером Веб-Ларька.

**Конструктор:**  
`constructor(baseUrl: string, options?: RequestInit)` — принимает базовый адрес сервера и опциональные настройки запросов.

**Методы класса:**  
- `getProducts(): Promise<IProductsResponse>` — выполняет GET запрос на `/product` и возвращает каталог товаров.
- `postOrder(order: IOrder): Promise<IOrderResponse>` — выполняет POST запрос на `/order` и отправляет данные заказа.

## Схема взаимодействия данных

```text
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN.TS                                 │
│            (создает экземпляры всех классов)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ ProductsModel│   │ BasketModel  │   │  BuyerModel  │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ - items      │   │ - items      │   │ - payment    │
│ - selected   │   ├──────────────┤   │ - email      │
├──────────────┤   │ + addItem()  │   │ - phone      │
│ + setItems() │   │ + removeItem │   │ - address    │
│ + getItems() │   │ + clear()    │   ├──────────────┤
│ + getById()  │   │ + getTotal() │   │ + setData()  │
│ + setSelected│   │ + getCount() │   │ + getData()  │
│ + getSelected│   │ + isInBasket │   │ + clear()    │
└──────────────┘   └──────────────┘   │ + validate() │
       │                  │           └──────────────┘
       └──────────────────┼──────────────────┘
                          ↓
                 ┌──────────────┐
                 │   AppApi     │
                 ├──────────────┤
                 │ + getProducts│
                 │ + postOrder  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │   Сервер     │
                 └──────────────┘
```
                 
## Событийная модель

Базовый брокер событий `EventEmitter` обеспечивает связь между слоями:

| Событие | Инициатор | Данные | Обработчик |
|---------|-----------|--------|------------|
| `products:loaded` | `AppApi` | `IProduct[]` | `ProductsModel.setItems()` |
| `product:select` | `View` | `string` (id) | `ProductsModel.setSelectedItem()` |
| `basket:add` | `View` | `IProduct` | `BasketModel.addItem()` |
| `basket:remove` | `View` | `string` (id) | `BasketModel.removeItem()` |
| `order:submit` | `View` | `IOrder` | `AppApi.postOrder()` |

## Компоненты представления (View)

Все компоненты представления наследуются от базового класса `Component` и находятся в папке `src/components/view/`. Каждый компонент отвечает за отображение своей части интерфейса.

### Класс `Header`

Отвечает за отображение шапки сайта с логотипом и корзиной.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент шапки и брокер событий.

**Поля класса:**  
- `_counterElement: HTMLElement` — элемент, отображающий количество товаров в корзине.
- `_basketButton: HTMLButtonElement` — кнопка открытия корзины.

**Сеттеры:**  
- `counter(value: number)` — обновляет счетчик товаров в корзине.

**Генерируемые события:**  
- `basket:open` — при клике на кнопку корзины.

---

### Класс `Gallery`

Отвечает за отображение каталога товаров.

**Конструктор:**  
`constructor(container: HTMLElement)` — принимает DOM-элемент контейнера галереи.

**Поля класса:**  
- `_container: HTMLElement` — контейнер для карточек товаров.

**Сеттеры:**  
- `catalog(items: HTMLElement[])` — устанавливает список карточек в галерею.

---

### Класс `Card`

Базовый абстрактный класс для всех видов карточек товаров. Содержит общие свойства и методы.

#### Наследники:

**`CardCatalog`** — карточка товара в каталоге.
- **Конструктор:** `(container: HTMLElement, events: IEvents)`
- **Сеттер `data(product: IProduct)`** — заполняет карточку данными товара.
- **Генерируемые события:** `card:select` (клик по карточке), `card:buy` (клик по кнопке "Купить").

**`CardPreview`** — карточка товара в модальном окне (детальный просмотр).
- **Конструктор:** `(container: HTMLElement, events: IEvents)`
- **Сеттеры:** `data(product: IProduct)`, `buttonText(value: string)`, `buttonDisabled(value: boolean)`, `buttonAction(action: () => void)`.
- **Генерируемые события:** через `buttonAction` вызывается внешний обработчик (добавление/удаление товара).

**`CardBasket`** — карточка товара в корзине.
- **Конструктор:** `(container: HTMLElement, events: IEvents)`
- **Сеттер `data(value: IProduct & { index: number })`** — заполняет карточку данными и номером позиции.
- **Генерируемые события:** `basket:remove` (клик по кнопке удаления).

---

### Класс `Basket`

Отвечает за отображение корзины.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент корзины и брокер событий.

**Поля класса:**  
- `_list: HTMLElement` — список товаров в корзине.
- `_total: HTMLElement` — элемент для отображения общей стоимости.
- `_button: HTMLButtonElement | null` — кнопка "Оформить".

**Сеттеры:**  
- `items(value: HTMLElement[])` — устанавливает список товаров.
- `total(value: number)` — устанавливает общую стоимость.

**Генерируемые события:**  
- `basket:checkout` — при клике на кнопку "Оформить".

---

### Класс `Modal`

Отвечает за отображение модальных окон.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент модального окна и брокер событий.

**Поля класса:**  
- `_closeButton: HTMLButtonElement` — кнопка закрытия.
- `_content: HTMLElement` — контейнер для содержимого модалки.

**Сеттеры:**  
- `content(value: HTMLElement)` — устанавливает содержимое модального окна.

**Методы:**  
- `open(): void` — открывает модальное окно.
- `close(): void` — закрывает модальное окно.
- `isOpen(): boolean` — возвращает состояние модального окна.

**Генерируемые события:**  
- `modal:close` — при закрытии модального окна.

---

### Класс `FormOrder`

Отвечает за отображение формы оформления заказа (шаг 1: способ оплаты + адрес).

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент формы и брокер событий.

**Поля класса:**  
- `_addressInput: HTMLInputElement | null` — поле ввода адреса.
- `_cardButton: HTMLButtonElement | null` — кнопка выбора оплаты картой.
- `_cashButton: HTMLButtonElement | null` — кнопка выбора оплаты наличными.
- `_hasAttemptedSubmit: boolean` — флаг, была ли попытка отправки формы.

**Сеттеры:**  
- `payment(value: string | null)` — устанавливает выбранный способ оплаты.
- `address(value: string | null)` — устанавливает значение поля адреса.
- `errors(value: Record<string, string>)` — устанавливает сообщения об ошибках.
- `valid(value: boolean)` — блокирует/разблокирует кнопку "Далее".

**Методы:**  
- `showErrors(): void` — включает режим отображения ошибок.
- `reset(): void` — сбрасывает состояние формы.

**Генерируемые события:**  
- `order:payment` — при выборе способа оплаты.
- `order:address` — при вводе адреса.
- `order:next` — при нажатии кнопки "Далее".

---

### Класс `FormContacts`

Отвечает за отображение формы контактов (шаг 2: email + телефон).

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент формы и брокер событий.

**Поля класса:**  
- `_emailInput: HTMLInputElement | null` — поле ввода email.
- `_phoneInput: HTMLInputElement | null` — поле ввода телефона.
- `_hasAttemptedSubmit: boolean` — флаг, была ли попытка отправки формы.

**Сеттеры:**  
- `email(value: string | null)` — устанавливает значение поля email.
- `phone(value: string | null)` — устанавливает значение поля телефона.
- `errors(value: Record<string, string>)` — устанавливает сообщения об ошибках.
- `valid(value: boolean)` — блокирует/разблокирует кнопку "Оплатить".

**Методы:**  
- `showErrors(): void` — включает режим отображения ошибок.
- `reset(): void` — сбрасывает состояние формы.

**Генерируемые события:**  
- `contacts:email` — при вводе email.
- `contacts:phone` — при вводе телефона.
- `contacts:pay` — при нажатии кнопки "Оплатить".

---

### Класс `Success`

Отвечает за отображение сообщения об успешном оформлении заказа.

**Конструктор:**  
`constructor(container: HTMLElement, events: IEvents)` — принимает DOM-элемент и брокер событий.

**Поля класса:**  
- `_total: HTMLElement` — элемент для отображения списанной суммы.
- `_button: HTMLButtonElement` — кнопка закрытия.

**Сеттеры:**  
- `total(value: number)` — устанавливает сумму, списанную за заказ.

**Генерируемые события:**  
- `success:close` — при клике на кнопку "За новыми покупками!".

---

## Полная карта событий в приложении

| Событие | Источник | Данные | Обработчик |
|---------|----------|--------|------------|
| `products:loaded` | `AppApi` | `IProduct[]` | `ProductsModel.setItems()` → `renderGallery()` |
| `card:select` | `CardCatalog` | `IProduct` | `ProductsModel.setSelectedItem()` → `renderProductPreview()` |
| `card:buy` | `CardCatalog` | `IProduct` | `BasketModel.addItem()` → `basket:changed` |
| `basket:add` | `CardPreview` | `IProduct` | `BasketModel.addItem()` → `basket:changed` → `modal.close()` |
| `basket:remove` | `CardPreview` / `CardBasket` | `{ id: string }` | `BasketModel.removeItem()` → `basket:changed` → `modal.close()` |
| `basket:changed` | `BasketModel` | — | `Header.counter`, `Basket.render()` |
| `basket:open` | `Header` | — | `Basket.render()` → `Modal.open()` |
| `basket:checkout` | `Basket` | — | `FormOrder.render()` → `Modal.open()` |
| `order:payment` | `FormOrder` | `{ payment: string }` | `BuyerModel.setData()` → `renderFormOrder()` |
| `order:address` | `FormOrder` | `{ address: string }` | `BuyerModel.setData()` → `renderFormOrder()` |
| `order:next` | `FormOrder` | — | `FormContacts.render()` → `Modal.update()` |
| `contacts:email` | `FormContacts` | `{ email: string }` | `BuyerModel.setData()` → `renderFormContacts()` |
| `contacts:phone` | `FormContacts` | `{ phone: string }` | `BuyerModel.setData()` → `renderFormContacts()` |
| `contacts:pay` | `FormContacts` | — | `AppApi.postOrder()` → `Success.render()` |
| `success:close` | `Success` | — | `Modal.close()` |
| `modal:close` | `Modal` | — | `FormOrder.reset()`, `FormContacts.reset()` |