<p align="center">
  <img src="https://cdn.simpleicons.org/cloudflare/F38020?viewbox=auto&size=68" alt="Cloudflare logo" height="68" />
  <span>&nbsp;+&nbsp;</span>
  <img src="https://camo.githubusercontent.com/ede9710f2920f243f0e56cb036684fff6fef9c0a174ea5bb92109e5ef72c3812/68747470733a2f2f726177322e736561646e2e696f2f657468657265756d2f3078356565333632383636303031363133303933333631656238353639643539633431343162373664312f3766613963653930306662333962343432323633343864623333306533322f38623766613963653930306662333962343432323633343864623333306533322e737667" alt="Xray logo" height="68" />
</p>

<p align="center">
  <a href="https://workers.cloudflare.com/">
    <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript Strict" />
  </a>
  <a href="/.github/workflows/deploy.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/PdYrust/cf-xray-proxy/deploy.yml?branch=main&label=deploy" alt="Deploy" />
  </a>
  <a href="/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
  </a>
</p>

# cf-xray-proxy

Cloudflare Worker reverse-proxy frontend for VLESS, VMess, and Trojan traffic, forwarding `ws`, `xhttp`, and `httpupgrade` requests to an Xray or sing-box backend.

## What this project is

This repository provides a Worker entrypoint (`src/index.ts`) plus transport handlers (`src/transports/*`) that:

- accept inbound HTTP/Upgrade requests at Cloudflare edge,
- select a transport handler (`ws`, `xhttp`, or `httpupgrade`),
- forward path/query to backend as-is,
- bridge upgraded sockets between client and backend.

The backend remains the protocol/authentication authority.

## Why you would use it

- Put Cloudflare edge in front of an existing Xray/sing-box backend.
- Terminate TLS at the edge while keeping origin/backend on plain HTTP.
- Select transports per request via query/header/path without redeploying.
- Keep Worker logic thin and backend-focused for VLESS/VMess/Trojan validation and policy.

## Features

- Multi-backend support with weighted selection and automatic failover.
- Periodic backend health checking with auto-recovery.
- Exponential backoff retry with jitter for backend retries.
- Connection-based rate limiting (per-IP concurrent and per-minute attempts).
- UUID-based maximum active connection limiting.
- Optional subscription proxy (`/sub/...`) with in-memory caching (disabled by default).
- Built-in observability endpoints: `GET /health` and `GET /status` (when `DEBUG=true`).
- `GET /health` hides backend URLs/addresses by default via `HIDE_BACKEND_URLS=true`.

## Architecture

```mermaid
flowchart LR
  Client["Client (VLESS / VMess / Trojan)"] -->|HTTPS / TLS| Worker["Cloudflare Worker (this repo)"]
  Worker --> Router["Router / transport selection"]
  Worker --> BackendManager["BackendManager (weights, health checks, failover)"]
  Worker --> RateLimiter["RateLimiter (connection-based, per IP)"]
  Worker --> UUIDManager["UUIDManager (per-UUID active connection cap)"]
  Worker --> SubscriptionProxy["SubscriptionProxy (optional /sub routes)"]
  Worker -->|"HTTP or HTTPS\n(BACKEND_URL / BACKEND_LIST)"| BackendPool["Backend pool (Xray / sing-box)"]
  BackendPool --> BackendNodes["backend-1 / backend-2 / backend-N"]
  BackendPool --> BackendFunctions["authentication / protocol validation / routing"]
```

> TLS terminates at Cloudflare Worker edge. `BACKEND_URL` and each `BACKEND_LIST` entry can be `http://...` or `https://...`.

## Supported transports

| Transport | Handler file | Upgrade detection | Notes |
| --- | --- | --- | --- |
| `ws` | `src/transports/ws.ts` | `Connection: upgrade` + `Upgrade: websocket` | WebSocket upgrade + passthrough fallback |
| `xhttp` | `src/transports/xhttp.ts` | `Connection: upgrade` + `Upgrade: websocket` | Supports `mode` (`auto`/`packet-up`) and `ed` hint |
| `httpupgrade` | `src/transports/httpupgrade.ts` | `Connection: upgrade` + any `Upgrade` value | HTTP Upgrade semantics with shared WS bridging |

### Transport selection order

Selection logic is implemented in `src/index.ts`:

1. Query parameter `transport` (`xhttp`, `httpupgrade`, `ws`)
2. Header `x-transport-type`
3. Path prefix (`/xhttp/...`, `/httpupgrade/...`, `/ws/...`)
4. Environment/default transport (`TRANSPORT`, otherwise default `xhttp`)

### ☕ Support this project

If you find this project useful, consider supporting its development:

<p align="center">
  <a href="https://link.trustwallet.com/send?coin=195&address=TUWcBfKhmpLQBC961oCJf7zuXTN2ezMbkF&token_id=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t">
    <img src="https://img.shields.io/badge/USDT%20(TRC20)-26A17B?style=for-the-badge&logo=tether&logoColor=white" alt="USDT TRC20" />
  </a>
  <a href="https://app.tonkeeper.com/transfer/UQC_4BlT2iUlliYUDDCzkDBhBPrww3plMH3XqWaWeDRXfWVj">
    <img src="https://img.shields.io/badge/TON-0098EA?style=for-the-badge&logo=ton&logoColor=white" alt="TON" />
  </a>
</p>

<p align="center">
  <strong>USDT (TRC-20):</strong> <code>TUWcBfKhmpLQBC961oCJf7zuXTN2ezMbkF</code><br/>
  <strong>TON:</strong> <code>UQC_4BlT2iUlliYUDDCzkDBhBPrww3plMH3XqWaWeDRXfWVj</code>
</p>

## Documentation

- [Documentation index](docs/README.md)
- [Configuration](docs/configuration.md)
- [Multi-backend setup](docs/multi-backend-setup.md)
- [Rate limiting](docs/rate-limiting.md)
- [Subscription proxy](docs/subscription-proxy.md)
- [Quickstart](docs/quickstart.md)
- [Deployment guide](docs/deployment-guide.md)

## Routing behavior

- Path and query are forwarded exactly from inbound request to backend URL.
- Worker does not inject fixed paths.
- Worker strips transport prefix only when that same prefix selected routing:
  - `/ws/<path>` -> `/<path>`
  - `/xhttp/<path>` -> `/<path>`
  - `/httpupgrade/<path>` -> `/<path>`
- Worker-only routing selectors are removed before backend forward:
  - query `transport`
  - header `x-transport-type`
- Worker does not validate UUID, port, or path.

> Authentication, UUID checks, and policy enforcement belong on backend Xray/sing-box.
