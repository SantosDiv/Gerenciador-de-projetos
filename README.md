# Project Manager

Um gerenciador de projetos moderno e intuitivo construído com Vue 3, TypeScript e Vite. Este projeto permite criar, editar, visualizar e organizar seus projetos de forma eficiente.

## 📋 Sobre o Projeto

O Project Manager é uma aplicação web para gerenciamento de projetos que oferece:

- 📝 Criação e edição de projetos
- 🔍 Sistema de busca e filtros
- 📅 Controle de datas e prazos
- ⭐ Sistema de favoritos
- 📱 Design responsivo
- 🎨 Interface construída com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápido
- **Vue Router** - Roteamento para Vue.js
- **Pinia** - Gerenciamento de estado
- **Tailwind CSS** - Framework CSS utilitário
- **Day.js** - Biblioteca para manipulação de datas
- **Vue Toastification** - Sistema de notificações

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Yarn ou npm

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd project-manager
```

2. Instale as dependências:
```bash
yarn install
# ou
npm install
```

### Executando o Projeto

Para executar o projeto em modo de desenvolvimento:

```bash
yarn dev
```

O projeto estará disponível em `http://localhost:5173`

### Build para Produção

Para gerar o build de produção:

```bash
yarn build
```

### Preview do Build

Para visualizar o build de produção localmente:

```bash
yarn preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── stores/        # Gerenciamento de estado (Pinia)
├── routes/        # Configuração de rotas
├── interfaces/    # Interfaces TypeScript
├── utils/         # Utilitários e helpers
├── assets/        # Recursos estáticos
└── api/          # Configuração de API
```
