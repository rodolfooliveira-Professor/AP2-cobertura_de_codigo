const { Order, Item } = require("../src/order");

describe("testes unitarios de Order e Item (cobertura 100%)", () => {
  test("Item deve ser construido com id, nome e classe", () => {
    const item = new Item("i1", "Produto A", 12.5);
    expect(item.id).toBe("i1");
    expect(item.name).toBe("Produto A");
    expect(item.price).toBe(12.5);
  });

  test("Testar inicialização padrão da classe Order e total para itens vazios", () => {
    const order = new Order("o1");
    expect(order.id).toBe("o1");
    expect(order.items).toEqual([]);
    expect(order.paymentMethod).toBe("cash");
    expect(order.status).toBe("created");
    expect(order.total).toBe(0);
    expect(order.calculateTotal()).toBe(0);
  });

  test("Testar se Order calcula o total dos itens corretamente", () => {
    const items = [
      new Item("i1", "A", 10),
      new Item("i2", "B", 20),
    ];
    const order = new Order("o2", items, "card");
    expect(order.paymentMethod).toBe("card");
    expect(order.total).toBe(30);
    expect(order.calculateTotal()).toBe(30);
  });

  test("Testar se addItem atualiza a lista de items e o Total", () => {
    const order = new Order("o3");
    const it1 = new Item("i1", "A", 5);
    const it2 = new Item("i2", "B", 7);
    order.addItem(it1);
    expect(order.items).toContain(it1);
    expect(order.total).toBe(5);
    order.addItem(it2);
    expect(order.items).toContain(it2);
    expect(order.total).toBe(12);
  });

  test("testar se função removeItem remove pelo ID e calcula o total novamente", () => {
    const it1 = new Item("i1", "A", 5);
    const it2 = new Item("i2", "B", 7);
    const order = new Order("o4", [it1, it2]);
    expect(order.total).toBe(12);
    order.removeItem("i1");
    expect(order.items.find(i => i.id === "i1")).toBeUndefined();
    expect(order.total).toBe(7);
  });

  test("Testar se removeItem com ID inexistente não altera o total", () => {
    const it1 = new Item("i1", "A", 5);
    const order = new Order("o5", [it1]);
    expect(order.total).toBe(5);
    order.removeItem("no-such-id");
    expect(order.total).toBe(5);
    expect(order.items.length).toBe(1);
  });

  test("Testar se função pay transiciona o status de created para paid e previne o pagamento repetido", () => {
    const order = new Order("o6");
    expect(order.status).toBe("created");
    order.pay();
    expect(order.status).toBe("paid");
    expect(() => order.pay()).toThrow("Order cannot be paid");
  });

  test("Testar se funcao complete so permite a transição quando a Order está paga e se seta o status para completed", () => {
    const order = new Order("o7");
    expect(() => order.complete()).toThrow("Order must be paid before it can be completed");
    order.pay();
    order.complete();
    expect(order.status).toBe("completed");
  });

  test("Testar se funcao cancel seta o status para cancelled e se restringe caso o pedido esteja completed", () => {
    const order1 = new Order("o8");
    order1.cancel();
    expect(order1.status).toBe("cancelled");

    const order2 = new Order("o9");
    order2.pay();
    order2.cancel(); // o cancel é permitido mesmo se pago, o codigo só previne se a estiver completed
    expect(order2.status).toBe("cancelled");

    const order3 = new Order("o10");
    order3.pay();
    order3.complete();
    expect(order3.status).toBe("completed");
    expect(() => order3.cancel()).toThrow("Completed order cannot be cancelled");
  });
});
