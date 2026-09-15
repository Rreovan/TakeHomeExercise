import { test, expect } from '@playwright/test';

test.describe('/todos', () => {
  test('API-040 GET all todos', async ({ request }) => {
    const res = await request.get('/todos');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(200);
    for (const todo of body) {
      expect(todo).toEqual(
        expect.objectContaining({
          userId: expect.any(Number),
          id: expect.any(Number),
          title: expect.any(String),
          completed: expect.any(Boolean),
        })
      );
    }
  });

  test('API-041 GET todos nested under user', async ({ request }) => {
    const res = await request.get('/users/1/todos');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const todo of body) {
      expect(todo.userId).toBe(1);
    }
  });

  test('API-042 Filter completed todos', async ({ request }) => {
    const res = await request.get('/todos?completed=true');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const todo of body) {
      expect(todo.completed).toBe(true);
    }
  });

  test('API-043 POST todo with required fields', async ({ request }) => {
    const payload = { userId: 1, title: 'new todo', completed: false };
    const res = await request.post('/todos', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body).toHaveProperty('id');
  });
});
