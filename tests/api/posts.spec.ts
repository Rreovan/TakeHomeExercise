import { test, expect } from '@playwright/test';

test.describe('/posts', () => {
  test('API-001 GET all posts', async ({ request }) => {
    const res = await request.get('/posts');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(100);
    for (const post of body) {
      expect(post).toHaveProperty('userId');
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('body');
    }
  });

  test('API-002 GET post by valid id', async ({ request }) => {
    const res = await request.get('/posts/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body).toEqual(
      expect.objectContaining({
        userId: expect.any(Number),
        id: 1,
        title: expect.any(String),
        body: expect.any(String),
      })
    );
  });

  test('API-003 GET post by non-existent id', async ({ request }) => {
    const res = await request.get('/posts/9999');
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toEqual({});
  });

  test('API-004 Filter posts by userId', async ({ request }) => {
    const res = await request.get('/posts?userId=1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const post of body) {
      expect(post.userId).toBe(1);
    }
  });

  test('API-005 POST post with all fields', async ({ request }) => {
    const payload = { title: 'foo', body: 'bar', userId: 1 };
    const res = await request.post('/posts', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body.id).toBe(101);
  });

  test('API-006 POST post with required fields only (no body)', async ({ request }) => {
    const payload = { title: 'foo', userId: 1 };
    const res = await request.post('/posts', { data: payload });
    expect(res.status()).toBe(201);
    const responseBody = await res.json();
    // Mock does not require `body` - request succeeds without it.
    expect(responseBody).toEqual(expect.objectContaining(payload));
    expect(responseBody).toHaveProperty('id');
  });

  test('API-007 POST post missing all fields (mock non-validation)', async ({ request }) => {
    const res = await request.post('/posts', { data: {} });
    // JSONPlaceholder is a non-validating mock: it returns 201 even for an empty payload,
    // rather than a 400/422 a real backend would return.
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
  });

  test('API-008 PUT full update of post', async ({ request }) => {
    const payload = { id: 1, title: 'updated title', body: 'updated body', userId: 1 };
    const res = await request.put('/posts/1', { data: payload });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
  });

  test('API-009 PATCH partial update of post', async ({ request }) => {
    const res = await request.patch('/posts/1', { data: { title: 'patched title' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('patched title');
    expect(body.id).toBe(1);
  });

  test('API-010 DELETE a post', async ({ request }) => {
    const res = await request.delete('/posts/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toEqual({});
  });
});
