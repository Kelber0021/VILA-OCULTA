// @vitest-environment node
import { afterEach, describe, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

afterEach(() => vi.unstubAllEnvs());
describe('política de segurança das páginas', () => {
  test('produção usa nonce novo por documento e bloqueia scripts sem autorização', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const first = proxy(new NextRequest('https://vila.example/'));
    const second = proxy(new NextRequest('https://vila.example/'));
    const policy = first.headers.get('content-security-policy')!;
    const scripts = policy.split(';').find(p => p.trim().startsWith('script-src'))!;
    expect(scripts).toContain("'nonce-");
    expect(scripts).not.toContain('unsafe-inline');
    expect(scripts).not.toContain('unsafe-eval');
    expect(policy).not.toEqual(second.headers.get('content-security-policy'));
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(first.headers.get('cache-control')).toContain('no-store');
  });
});
