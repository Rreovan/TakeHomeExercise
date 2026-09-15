import { test, expect } from '@playwright/test';

test.describe('/albums & /photos (nested)', () => {
  test('API-030 GET all albums', async ({ request }) => {
    const res = await request.get('/albums');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(100);
    for (const album of body) {
      expect(album).toEqual(
        expect.objectContaining({
          userId: expect.any(Number),
          id: expect.any(Number),
          title: expect.any(String),
        })
      );
    }
  });

  test('API-031 GET albums nested under user', async ({ request }) => {
    const res = await request.get('/users/1/albums');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const album of body) {
      expect(album.userId).toBe(1);
    }
  });

  test('API-032 GET photos nested under album', async ({ request }) => {
    const res = await request.get('/albums/1/photos');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    for (const photo of body) {
      expect(photo.albumId).toBe(1);
    }
  });

  test('API-033 Filter photos by albumId (cross-check)', async ({ request }) => {
    const nested = await (await request.get('/albums/1/photos')).json();
    const filtered = await (await request.get('/photos?albumId=1')).json();
    expect(filtered).toHaveLength(nested.length);
    expect(filtered.map((p: any) => p.id).sort()).toEqual(nested.map((p: any) => p.id).sort());
  });

  test('API-034 POST album with required fields', async ({ request }) => {
    const payload = { userId: 1, title: 'new album' };
    const res = await request.post('/albums', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining(payload));
    expect(body).toHaveProperty('id');
  });
});
