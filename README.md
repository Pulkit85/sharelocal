<div align="center">

# ⚡ ShareLocal

<p align="center">
  <strong>Instantly share localhost with a mobile-friendly terminal QR code and zero-config public tunnels.</strong>
</p>

<p align="center">
  <a href="https://npmjs.com/package/sharelocal"><img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
  <a href="https://github.com/pulkitbisht/sharelocal/stargazers"><img src="https://img.shields.io/github/stars/pulkitbisht/sharelocal?style=for-the-badge&logo=github" alt="Stars" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" /></a>
</p>

</div>

<hr />

## 💡 Why ShareLocal?

When developing responsive websites, you constantly need to test how your layout looks on your real phone, or share a live demo with a colleague on Slack.

Traditionally you had to:
1. Find your Wi-Fi IP address in system settings.
2. Manually type `http://192.168.1.XX:3000` into your phone's tiny keyboard.
3. Or sign up for Ngrok, install an agent, authenticate, and deal with browser warning splash screens.

**ShareLocal makes it effortless.** Run `npx sharelocal 3000` and point your phone's camera at the terminal QR code. You're testing in 2 seconds.

---

## 🚀 Quick Start

No installation required! Run directly with `npx`:

```bash
# Share port 3000 on your local Wi-Fi with an instant QR code
npx sharelocal 3000

# Share another port (e.g. Vite, Next.js, Django)
npx sharelocal 5173

# Share over the public internet with a free HTTPS tunnel
npx sharelocal 3000 --tunnel

# Hide QR code and only print URLs
npx sharelocal 3000 --no-qr
```

Or install globally:

```bash
npm install -g sharelocal
sharelocal 3000
```

---

## ✨ Features

- 📱 **Terminal QR Code**: Renders a crisp ASCII QR code directly inside your terminal. Point your iOS or Android camera to open your local site immediately.
- ⚡ **Local Wi-Fi Auto-Discovery**: Detects your machine's local IP address (`192.168.X.X`) with zero setup. 100% private, zero latency.
- 🌍 **Zero-Config Public Tunnels**: Need to share with a remote client outside your house? Add `--tunnel` to get a secure HTTPS link powered by OpenSSH. No account or API keys required!
- 🔍 **Server Health Check**: Automatically verifies if your local server is running on the given port and alerts you if it hasn't started yet.

---

## 🛠️ CLI Options

```bash
Usage: sharelocal [options] [port]

Arguments:
  port           Local port to share (default: "3000")

Options:
  -t, --tunnel   Create a public internet tunnel (HTTPS) to share outside local Wi-Fi
  --no-qr        Do not display QR code in terminal
  -V, --version  Output the version number
  -h, --help     Display help for command
```

---

## 📝 License

Distributed under the **MIT** License. See [`LICENSE`](LICENSE) for more details.

<div align="center">

---
⭐ **If you find ShareLocal useful, give it a star on GitHub!** ⭐

</div>
