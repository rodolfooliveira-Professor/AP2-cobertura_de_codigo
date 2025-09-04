/**
* Esse trabalho é do grupo G4 (Adão Eduardo Gomes de Oliveira - 2023010692)
*/

const { Order, Item } = require("../src/order");

describe('Order', () => {
  let order;
  const item1 = new Item(1, 'Laptop', 3500);
  const item2 = new Item(2, 'Mouse', 150);

  beforeEach(() => {
    // Cria uma nova instância de Order antes de cada teste
    order = new Order(1);
  });

  // Testes para o Construtor e inicialização
  test('deve criar um pedido com valores padrão corretamente', () => {
    expect(order.id).toBe(1);
    expect(order.items).toEqual([]);
    expect(order.paymentMethod).toBe('cash');
    expect(order.status).toBe('created');
    expect(order.total).toBe(0);
  });

  test('deve criar um pedido com itens iniciais e calcular o total', () => {
    const initialOrder = new Order(2, [item1, item2], 'credit_card');
    expect(initialOrder.id).toBe(2);
    expect(initialOrder.items).toEqual([item1, item2]);
    expect(initialOrder.paymentMethod).toBe('credit_card');
    expect(initialOrder.status).toBe('created');
    expect(initialOrder.total).toBe(3650); // 3500 + 150
  });

  // Testes para o método calculateTotal
  test('calculateTotal deve retornar 0 para um pedido sem itens', () => {
    expect(order.calculateTotal()).toBe(0);
  });

  test('calculateTotal deve retornar a soma dos preços dos itens', () => {
    order.items = [item1, item2];
    expect(order.calculateTotal()).toBe(3650);
  });

  // Testes para o método addItem
  test('addItem deve adicionar um item ao pedido e recalcular o total', () => {
    order.addItem(item1);
    expect(order.items).toContain(item1);
    expect(order.total).toBe(3500);

    order.addItem(item2);
    expect(order.items).toContain(item2);
    expect(order.total).toBe(3650);
  });

  // Testes para o método removeItem
  test('removeItem deve remover um item do pedido e recalcular o total', () => {
    order.addItem(item1);
    order.addItem(item2);
    
    order.removeItem(1); // Remove o item com id 1
    expect(order.items).not.toContain(item1);
    expect(order.items).toContain(item2);
    expect(order.total).toBe(150);
  });

  // Testes para o método pay
  test('pay deve mudar o status do pedido para "paid"', () => {
    order.pay();
    expect(order.status).toBe('paid');
  });

  test('pay deve lançar um erro se o pedido não estiver com o status "created"', () => {
    order.status = 'completed'; // Força um status diferente
    expect(() => order.pay()).toThrow('Order cannot be paid');
  });

  // Testes para o método complete
  test('complete deve mudar o status para "completed" se o pedido estiver "paid"', () => {
    order.pay(); // Primeiro paga o pedido
    order.complete();
    expect(order.status).toBe('completed');
  });

  test('complete deve lançar um erro se o pedido não estiver "paid"', () => {
    expect(order.status).toBe('created');
    expect(() => order.complete()).toThrow('Order must be paid before it can be completed');
  });

  // Testes para o método cancel
  test('cancel deve mudar o status para "cancelled"', () => {
    order.cancel();
    expect(order.status).toBe('cancelled');
  });
  
  test('cancel deve funcionar para um pedido com status "paid"', () => {
    order.pay();
    order.cancel();
    expect(order.status).toBe('cancelled');
  });

  test('cancel deve lançar um erro se o pedido já estiver "completed"', () => {
    order.status = 'completed';
    expect(() => order.cancel()).toThrow('Completed order cannot be cancelled');
  });
});
