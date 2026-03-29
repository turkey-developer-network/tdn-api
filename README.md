<div align="center">

<br/>

# TDN-API

**The backend API powering The Developer Network —**  
**a community platform built for developers, by developers.**

<br/>

`Node.js` &nbsp;·&nbsp; `Fastify` &nbsp;·&nbsp; `PostgreSQL` &nbsp;·&nbsp; `Redis` &nbsp;·&nbsp; `Cloudflare R2`

<br/>

[![License](https://img.shields.io/badge/License-Source--Available-blue?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/the-developer-network/tdn-api/pulls)

<br/>

</div>

---

## Overview

TDN-API is the core RESTful backend service powering [developernetwork.net](https://developernetwork.net). All content is managed through a unified `Post` model, differentiated by a `type` field:

| Type     | Description                               |
| :------- | :---------------------------------------- |
| `post`   | General knowledge sharing and discussions |
| `job`    | Software industry job listings            |
| `news`   | Industry news and announcements           |
| `update` | Package and library release notices       |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `v25.8.1`
- [pnpm](https://pnpm.io/) `10.30.1`
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Installation

```bash
git clone https://github.com/the-developer-network/tdn-api.git
cd tdn-api
pnpm install
cp .env.example .env
```

Fill in all required variables in the `.env` file.

### Running

```bash
pnpm dev        # Development
pnpm build      # Build
pnpm start      # Production
```

---

## Authentication

JWT-based **Access + Refresh Token** strategy.

| Token         | Lifetime | Usage                           |
| :------------ | :------: | :------------------------------ |
| Access Token  |  15 min  | `Authorization: Bearer <token>` |
| Refresh Token |  30 min  | Obtain a new access token       |

OAuth sign-in via **GitHub** and **Google** is supported.

---

## 📖 API Documentation

Visit our interactive documentation for all endpoint details, request/response models, and the test environment:

- **[api.developernetwork.net/api/v1/docs](https://api.developernetwork.net/api/v1/docs)**

## Contributing

Open an issue before submitting significant changes.

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

## Contact

<div align="center">

[![Email](https://img.shields.io/badge/contact@developernetwork.net-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:contact@developernetwork.net)
&nbsp;
[![Admin](https://img.shields.io/badge/admin@developernetwork.net-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:admin@developernetwork.net)

</div>

---

## License

This repository is **source-available**. You are welcome to read, learn, and contribute.  
Commercial use or redistribution without explicit written permission is **not permitted**.

See the [LICENSE](./LICENSE) file for full terms.

---

<div align="center">

© 2026 The Developer Network. All rights reserved.

</div>
