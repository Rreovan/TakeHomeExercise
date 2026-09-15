import { test, expect } from '@playwright/test';

test.describe('/users', () => {
  test('API-050 GET all users', async ({ request }) => {
    const res = await request.get('/users');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(10);
    for (const user of body) {
      expect(user).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          address: expect.objectContaining({
            street: expect.any(String),
            city: expect.any(String),
            zipcode: expect.any(String),
            geo: expect.objectContaining({
              lat: expect.any(String),
              lng: expect.any(String),
            }),
          }),
          phone: expect.any(String),
          website: expect.any(String),
          company: expect.objectContaining({
            name: expect.any(String),
            catchPhrase: expect.any(String),
            bs: expect.any(String),
          }),
        })
      );
    }
  });

  test('API-051 GET single user by valid id', async ({ request }) => {
    const res = await request.get('/users/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.address).toHaveProperty('geo');
    expect(body).toHaveProperty('company');
  });

  test('API-052 GET user by non-existent id', async ({ request }) => {
    const res = await request.get('/users/9999');
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toEqual({});
  });

  test('API-053 POST user with required + optional fields', async ({ request }) => {
    const payload = {
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      address: {
        street: 'Main St',
        suite: 'Apt 1',
        city: 'Anytown',
        zipcode: '12345',
        geo: { lat: '0.0000', lng: '0.0000' },
      },
      phone: '555-1234',
      website: 'jane.example.com',
      company: { name: 'Acme', catchPhrase: 'Just do it', bs: 'synergize' },
    };
    const res = await request.post('/users', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body).toHaveProperty('id');
  });

  test('API-054 POST user with required fields only', async ({ request }) => {
    const payload = { name: 'Jane Doe', username: 'janedoe', email: 'jane@example.com' };
    const res = await request.post('/users', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    // Documents that optional fields (address, phone, website, company) aren't enforced by the mock.
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body).toHaveProperty('id');
  });

  test('API-055 GET posts nested under user (cross-check)', async ({ request }) => {
    const nested = await (await request.get('/users/1/posts')).json();
    const filtered = await (await request.get('/posts?userId=1')).json();
    expect(Array.isArray(nested)).toBe(true);
    for (const post of nested) {
      expect(post.userId).toBe(1);
    }
    expect(nested).toHaveLength(filtered.length);
    expect(nested.map((p: any) => p.id).sort()).toEqual(filtered.map((p: any) => p.id).sort());
  });
});
