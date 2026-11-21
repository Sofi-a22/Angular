import { Component, computed, signal } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  qty: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  // ---------- Counter ----------
  count = signal(0);
  double = computed(() => this.count() * 2);

  // ---------- Products ----------
  private initial: Product[] = [
    { id: 1, name: 'Keyboard', price: 200, qty: 1 },
    { id: 2, name: 'Mouse', price: 100, qty: 2 },
    { id: 3, name: 'Screen', price: 1500, qty: 1 },
  ];

  products = signal<Product[]>([...this.initial]);
  lastAction = signal('nothing yet');

  totalItems = computed(() =>
    this.products().reduce((sum, p) => sum + p.qty, 0)
  );

  totalPrice = computed(() =>
    this.products().reduce((sum, p) => sum + p.price * p.qty, 0)
  );

  increase(id: number) {
    this.products.update(list =>
      list.map(p => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );
    this.lastAction.set(`increase(${id}) with update + map`);
  }

  decrease(id: number) {
    this.products.update(list =>
      list.map(p => (p.id === id && p.qty > 1 ? { ...p, qty: p.qty - 1 } : p))
    );
    this.lastAction.set(`decrease(${id}) with update + map`);
  }

  remove(id: number) {
    this.products.update(list => list.filter(p => p.id !== id));
    this.lastAction.set(`remove(${id}) with update + filter`);
  }

  // RIGHT: new array
  add(name: string, price: number) {
    if (!name || !price) return;
    this.products.update(list => [
      ...list,
      { id: Date.now(), name, price, qty: 1 },
    ]);
    this.lastAction.set(`add("${name}") with update + [...list, new]`);
  }

  // WRONG: mutates the same array, the signal is not notified
  addWithPush() {
    this.products().push({ id: Date.now(), name: 'Pushed item', price: 999, qty: 1 });
    this.lastAction.set(
      `push done: array length is ${this.products().length}, but totals are still stale`
    );
  }

  // set: replace the whole value
  reset() {
    this.products.set([...this.initial]);
    this.lastAction.set('reset() with set');
  }
}