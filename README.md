# Bueiro2029 - Dashboard Administrativo

Dashboard administrativo para gerenciamento de anúncios e contas do Facebook.

## Requisitos

- Node.js >= 18.0.0
- npm >= 8.0.0

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bueiro2029.git
cd bueiro2029
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Para build de produção:
```bash
npm run build
```

## Estrutura do Projeto

```
bueiro2029/
├── src/                  # Código fonte
│   ├── js/              # Arquivos JavaScript
│   ├── css/             # Arquivos CSS/SCSS
│   └── index.html       # Página principal
├── dist/                # Arquivos compilados (gerado)
├── node_modules/        # Dependências (gerado)
├── package.json         # Configuração do projeto
├── webpack.config.js    # Configuração do Webpack
└── netlify.toml         # Configuração do Netlify
```

## Tecnologias Utilizadas

- HTML5
- CSS3/SCSS
- JavaScript (ES6+)
- Bootstrap 5
- jQuery
- Chart.js
- Webpack
- Babel

## Deploy

O projeto está configurado para deploy automático no Netlify. Qualquer push para a branch main irá disparar um novo deploy.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 