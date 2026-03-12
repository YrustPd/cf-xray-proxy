export function renderLandingPage(): Response {
  const telegramUrl = 'https://t.me/PdYrust';
  const githubUrl = 'https://github.com/PdYrust/cf-xray-proxy';

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="PdYrust project links" />
    <title>cf-xray-proxy</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;700;800&family=Space+Grotesk:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      :root {
        --bg-1: #081826;
        --bg-2: #0f2d3f;
        --bg-3: #0b3f5f;
        --glass: rgba(5, 17, 28, 0.64);
        --border: rgba(143, 221, 255, 0.36);
        --text-main: #e9fbff;
        --text-muted: #acd7e6;
        --tg-accent: #2aa3df;
        --gh-accent: #ff8e3a;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
      }

      body {
        font-family: 'Space Grotesk', 'Segoe UI', Tahoma, sans-serif;
        color: var(--text-main);
        background:
          radial-gradient(42rem 42rem at 12% -10%, #1a5072 0%, transparent 60%),
          radial-gradient(36rem 36rem at 95% 18%, #12496f 0%, transparent 62%),
          linear-gradient(130deg, var(--bg-1), var(--bg-2) 45%, var(--bg-3));
        display: grid;
        place-items: center;
      }

      .bg-shape {
        position: fixed;
        border-radius: 999px;
        filter: blur(2px);
        pointer-events: none;
      }

      .bg-shape.one {
        width: 14rem;
        height: 14rem;
        background: radial-gradient(circle at 35% 35%, #47b2ed, #197db6);
        top: 5%;
        right: 10%;
        opacity: 0.24;
        animation: drift 12s ease-in-out infinite;
      }

      .bg-shape.two {
        width: 18rem;
        height: 18rem;
        background: radial-gradient(circle at 30% 35%, #ffab70, #d45b18);
        bottom: -3rem;
        left: -3rem;
        opacity: 0.2;
        animation: drift 14s ease-in-out infinite reverse;
      }

      .layout {
        width: min(940px, 94vw);
        height: min(620px, 92vh);
        padding: clamp(1.1rem, 2.6vw, 2rem);
        border-radius: 1.75rem;
        background: linear-gradient(160deg, rgba(5, 18, 31, 0.84), var(--glass));
        border: 1px solid var(--border);
        box-shadow:
          0 28px 70px rgba(2, 11, 20, 0.62),
          inset 0 1px 0 rgba(209, 246, 255, 0.14);
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: clamp(0.9rem, 2vw, 1.4rem);
      }

      .title {
        margin: 0;
        font-family: 'Sora', 'Space Grotesk', sans-serif;
        font-size: clamp(1.35rem, 3.1vw, 2.45rem);
        letter-spacing: 0.02em;
        font-weight: 800;
      }

      .subtitle {
        margin: 0.35rem 0 0;
        color: var(--text-muted);
        font-size: clamp(0.92rem, 1.6vw, 1.02rem);
      }

      .links {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: clamp(0.8rem, 1.8vw, 1.1rem);
        align-items: stretch;
      }

      .card {
        border-radius: 1.35rem;
        border: 1px solid rgba(171, 228, 255, 0.27);
        padding: clamp(1rem, 2.4vw, 1.6rem);
        text-decoration: none;
        color: inherit;
        background: linear-gradient(160deg, rgba(5, 22, 37, 0.73), rgba(6, 28, 45, 0.52));
        display: grid;
        align-content: center;
        justify-items: center;
        gap: clamp(0.65rem, 1.3vw, 0.85rem);
        transform: translateY(24px);
        opacity: 0;
        animation: rise 0.7s ease forwards;
        transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease, background 240ms ease;
      }

      .card.github {
        animation-delay: 0.09s;
      }

      .card:hover {
        transform: translateY(-5px) scale(1.012);
        border-color: rgba(224, 243, 255, 0.62);
        box-shadow: 0 14px 38px rgba(0, 0, 0, 0.32);
        background: linear-gradient(160deg, rgba(12, 39, 60, 0.75), rgba(8, 29, 45, 0.52));
      }

      .icon-wrap {
        width: clamp(5rem, 10vw, 6.4rem);
        height: clamp(5rem, 10vw, 6.4rem);
        border-radius: 1.4rem;
        display: grid;
        place-items: center;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.24),
          0 10px 22px rgba(0, 0, 0, 0.24);
      }

      .icon-wrap.telegram {
        background: radial-gradient(circle at 35% 35%, #54c0f3, var(--tg-accent));
      }

      .icon-wrap.github {
        background: radial-gradient(circle at 35% 35%, #ffba80, var(--gh-accent));
      }

      .icon-wrap svg {
        width: clamp(2.6rem, 5vw, 3.35rem);
        height: clamp(2.6rem, 5vw, 3.35rem);
        display: block;
        filter: drop-shadow(0 2px 8px rgba(4, 12, 18, 0.3));
      }

      .icon-wrap.telegram svg {
        width: clamp(2.8rem, 5.2vw, 3.5rem);
        height: clamp(2.8rem, 5.2vw, 3.5rem);
        transform: translateX(0.04rem);
      }

      .icon-wrap.github svg {
        transform: translateY(0.02rem);
      }

      .label {
        font-family: 'Sora', 'Space Grotesk', sans-serif;
        font-size: clamp(1.15rem, 2.2vw, 1.6rem);
        font-weight: 700;
        margin: 0;
      }

      .url {
        margin: 0;
        color: #d3eef9;
        font-size: clamp(0.92rem, 1.8vw, 1.08rem);
      }

      .note {
        margin: 0;
        color: #a4cfdf;
        font-size: clamp(0.77rem, 1.35vw, 0.91rem);
        text-align: center;
      }

      @media (max-width: 760px) {
        .layout {
          width: min(560px, 94vw);
          height: min(680px, 94vh);
        }

        .links {
          grid-template-columns: 1fr;
        }
      }

      @keyframes rise {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes drift {
        0%, 100% {
          transform: translateY(0) translateX(0) scale(1);
        }
        50% {
          transform: translateY(12px) translateX(-8px) scale(1.03);
        }
      }
    </style>
  </head>
  <body>
    <div class="bg-shape one" aria-hidden="true"></div>
    <div class="bg-shape two" aria-hidden="true"></div>

    <main class="layout">
      <header>
        <h1 class="title">cf-xray-proxy</h1>
        <p class="subtitle">Edge frontend for VLESS / VMess on Cloudflare Workers</p>
      </header>

      <section class="links" aria-label="Project links">
        <a class="card telegram" href="${telegramUrl}" target="_blank" rel="noopener noreferrer">
          <div class="icon-wrap telegram" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16-1.8 8.496c-.132.588-.48.732-.972.456l-2.688-1.98-1.296 1.248c-.144.144-.264.264-.54.264l.192-2.736 4.98-4.5c.216-.192-.048-.3-.336-.108l-6.156 3.876-2.652-.828c-.576-.18-.588-.576.12-.852l10.356-3.996c.48-.18.9.108.792.78z" fill="#fff"/>
            </svg>
          </div>
          <p class="label">Telegram</p>
          <p class="url">t.me/PdYrust</p>
        </a>

        <a class="card github" href="${githubUrl}" target="_blank" rel="noopener noreferrer">
          <div class="icon-wrap github" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.2-1.11-1.52-1.11-1.52-.9-.64.07-.63.07-.63 1 .07 1.52 1.05 1.52 1.05.89 1.57 2.33 1.11 2.9.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.31 9.31 0 0 1 12 6.85c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.58 5.08.36.31.68.93.68 1.88 0 1.35-.01 2.43-.01 2.76 0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.23C22 6.58 17.52 2 12 2z" fill="#fff"/>
            </svg>
          </div>
          <p class="label">GitHub</p>
          <p class="url">github.com/PdYrust/cf-xray-proxy</p>
        </a>
      </section>

      <p class="note">Built and maintained by PdYrust</p>
    </main>
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
