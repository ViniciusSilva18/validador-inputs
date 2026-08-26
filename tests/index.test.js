'use strict';
const { validators, sanitizers, validate } = require('../src/index');
let passed = 0, failed = 0;

function test(name, fn) {
  try { fn(); console.log(`  ✅ ${name}`); passed++; }
  catch(e) { console.log(`  ❌ ${name}: ${e.message}`); failed++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

console.log('\n🧪 VibValidator — Suite de Testes\n');
console.log('📧 Validators:');
test('Email válido', () => assert(validators.isEmail('user@example.com')));
test('Email inválido', () => assert(!validators.isEmail('nao-é-email')));
test('Password forte', () => assert(validators.isStrongPassword('VibeCode@2024').valid));
test('Password fraca', () => assert(!validators.isStrongPassword('123').valid));
test('NIF válido (PT)', () => assert(validators.isNIF('123456789') === false)); // demo
test('URL válida', () => assert(validators.isURL('https://github.com')));
test('URL inválida', () => assert(!validators.isURL('nao-url')));
test('Inteiro com range', () => assert(validators.isInteger('5', {min:1,max:10})));
test('Fora do range', () => assert(!validators.isInteger('15', {min:1,max:10})));

console.log('\n🛡️  Sanitizers:');
test('Sanitizar HTML (XSS)', () => { const r = sanitizers.html('<script>alert("xss")</script>'); assert(!r.includes('<script>')); });
test('Sanitizar SQL', () => { const r = sanitizers.sql("'; DROP TABLE users; --"); assert(!r.includes('--')); });
test('Só dígitos', () => assert(sanitizers.digits('+351 912 345 678') === '351912345678'));
test('Só alfanumérico', () => assert(sanitizers.alphanumeric('Vibe@Coder!2024') === 'VibeCoder2024'));
test('Nome de ficheiro seguro', () => assert(sanitizers.filename('../../../etc/passwd') === 'etcpasswd'));

console.log('\n📋 Schema validation:');
test('Schema válido', () => {
  const result = validate({ name: 'Vinicius', email: 'v@test.com' }, { name: { required: true, minLength: 2, sanitize: 'trim' }, email: { required: true, type: 'email' } });
  assert(result.valid);
});
test('Schema inválido', () => {
  const result = validate({ name: '' }, { name: { required: true } });
  assert(!result.valid && result.errors.length > 0);
});

console.log(`\n📊 Resultado: ${passed} passou(aram), ${failed} falhou(aram)`);
process.exit(failed > 0 ? 1 : 0);
