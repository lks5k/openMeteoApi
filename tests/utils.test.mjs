import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolverCodigo } from '../lib/wmo.mjs';
import {
  parsearConsulta,
  normalizar,
  gradosACardinal,
  claveCache,
} from '../lib/utils.mjs';

describe('resolverCodigo (WMO)', () => {
  it('devuelve texto y emoji para un código conocido', () => {
    const r = resolverCodigo(0);
    assert.equal(r.texto, 'Cielo despejado');
    assert.equal(r.emoji, '☀️');
  });

  it('usa fallback para códigos desconocidos', () => {
    const r = resolverCodigo(999);
    assert.equal(r.texto, 'Estado 999');
    assert.equal(r.emoji, '🌡️');
  });
});

describe('utilidades de consulta', () => {
  it('parsearConsulta separa ciudad y país', () => {
    assert.deepEqual(parsearConsulta('Madrid, España'), {
      termino: 'Madrid',
      paisHint: 'España',
    });
    assert.deepEqual(parsearConsulta('Londres'), {
      termino: 'Londres',
      paisHint: null,
    });
  });

  it('normalizar elimina tildes para comparación segura', () => {
    assert.equal(normalizar('España'), 'espana');
    assert.equal(normalizar('São Paulo'), 'sao paulo');
  });

  it('gradosACardinal mapea ángulos a puntos cardinales', () => {
    assert.equal(gradosACardinal(0), 'N');
    assert.equal(gradosACardinal(90), 'E');
    assert.equal(gradosACardinal(225), 'SO');
  });

  it('claveCache redondea coordenadas a dos decimales', () => {
    assert.equal(claveCache(4.711, -74.072), 'wc-4.71_-74.07');
  });
});
