import { test, expect } from '@playwright/test';

test.describe('/comments (nested under posts)', () => {
  test('API-020 GET all comments', async ({ request }) => {
    const res = await request.get('/comments');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(500);
    for (const comment of body) {
      expect(comment).toEqual(
        expect.objectContaining({
          postId: expect.any(Number),
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          body: expect.any(String),
        })
      );
    }
  });

  test('API-021 GET comments nested under post', async ({ request }) => {
    const res = await request.get('/posts/1/comments');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const comment of body) {
      expect(comment.postId).toBe(1);
    }
  });

  test('API-022 GET comments filtered by postId (cross-check)', async ({ request }) => {
    const nested = await (await request.get('/posts/1/comments')).json();
    const filtered = await (await request.get('/comments?postId=1')).json();
    expect(filtered).toHaveLength(nested.length);
    expect(filtered.map((c: any) => c.id).sort()).toEqual(nested.map((c: any) => c.id).sort());
  });

  test('API-023 GET single comment by id', async ({ request }) => {
    const res = await request.get('/comments/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('API-024 POST comment with required fields', async ({ request }) => {
    const payload = { postId: 1, name: 'test comment', email: 'test@example.com', body: 'a comment' };
    const res = await request.post('/comments', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body).toHaveProperty('id');
  });

  test('API-025 POST comment missing email (mock non-validation)', async ({ request }) => {
    const payload = { postId: 1, name: 'test comment', body: 'a comment' };
    const res = await request.post('/comments', { data: payload });
    // Documents lack of required-field enforcement on the mock API.
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body.email).toBeUndefined();
  });
});
