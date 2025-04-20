# BM Multi Acessos - Dashboard de Anúncios Facebook

Dashboard para gerenciamento de anúncios e contas do Facebook Ads.

## Requisitos

- Node.js 18 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/bm-multi-acessos.git
cd bm-multi-acessos
```

2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Isso irá:
- Compilar os arquivos SCSS em tempo real
- Compilar os arquivos JavaScript com webpack em modo watch

## Build para Produção

Para criar uma build de produção:

```bash
npm run build
```

Isso irá:
- Compilar e minificar os arquivos SCSS
- Compilar e otimizar os arquivos JavaScript

## Deploy no Netlify

O projeto está configurado para deploy automático no Netlify. Basta conectar seu repositório ao Netlify e o deploy será feito automaticamente quando houver push para a branch principal.

## Estrutura do Projeto

```
dashboard/
├── admin/
│   ├── css/
│   │   ├── style.scss
│   │   ├── style.css
│   │   └── adsets.css
│   ├── js/
│   │   ├── main.js
│   │   ├── FacebookAPI.js
│   │   └── AdSetsManager.js
│   └── index.html
└── dist/
    └── js/
        ├── main.bundle.js
        ├── facebook.bundle.js
        └── adsets.bundle.js
```

## Tecnologias Utilizadas

- HTML5
- CSS3 (SCSS)
- JavaScript (ES6+)
- Bootstrap 5
- Chart.js
- jQuery
- Select2
- SweetAlert2
- Webpack
- SASS

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 