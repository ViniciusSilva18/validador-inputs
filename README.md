<div align="center">

# ✔️ Validador de Inputs — VibValidator

**Biblioteca de validação e sanitização para prevenção de XSS, SQL Injection e outros ataques de injeção.**

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Security](https://img.shields.io/badge/Security-OWASP-f43f5e?style=for-the-badge)]()

</div>

## ✨ Funcionalidades
- 📧 Validação de Email, URL, Telefone (PT/BR), NIF, Data
- 🔒 Verificação de força de password (5 critérios)
- 🛡️ Sanitização contra XSS e SQL Injection
- 📋 Validação por schema com mensagens de erro personalizadas

## 🚀 Uso
```javascript
const { validators, sanitizers, validate } = require('./src');

// Sanitizar input do utilizador
const safeHtml = sanitizers.html('<script>alert("xss")</script>');

// Validar schema
const result = validate(req.body, {
  email: { required: true, type: 'email' },
  name: { required: true, minLength: 2, sanitize: 'trim' }
});

// Executar testes
node tests/index.test.js
```

---
<sub>Criado por <a href="https://github.com/ViniciusSilva18">ViniciusSilva18</a> — VibeCoder 🇵🇹</sub>
