/**
* Esse trabalho é do grupo G#id

const { Order, Item } = require("../src/order");

describe("Testes iniciais - placeholder", () => {
  test("teste mínimo para validar setup", () => {
    expect(true).toBe(true);
  });
});*/

const { Order, Item } = require("../src/order");

describe("Order class - cobertura total", () => {
  let order, item1, item2;

  beforeEach(() => {
    item1 = new Item(1, "Item 1", 100);
    item2 = new Item(2, "Item 2", 200);
    order = new Order(1, [item1]);
  });

  test("calcular total inicial", () => {
    expect(order.total).toBe(100);
  });

  test("adicionar item", () => {
    order.addItem(item2);
    expect(order.total).toBe(300);
  });

  test("remover item", () => {
    order.addItem(item2);
    order.removeItem(1);
    expect(order.total).toBe(200);
  });

  test("pagar pedido correto", () => {
    order.pay();
    expect(order.status).toBe("paid");
  });

  test("pagar pedido errado", () => {
    order.pay();
    expect(() => order.pay()).toThrow("Order cannot be paid");
  });

  test("completar pedido correto", () => {
    order.pay();
    order.complete();
    expect(order.status).toBe("completed");
  });

  test("completar pedido errado", () => {
    expect(() => order.complete()).toThrow(
      "Order must be paid before it can be completed"
    );
  });

  test("cancelar pedido não completado", () => {
    order.cancel();
    expect(order.status).toBe("cancelled");
  });

  test("cancelar pedido completado", () => {
    order.pay();
    order.complete();
    expect(() => order.cancel()).toThrow("Completed order cannot be cancelled");
  });
});
