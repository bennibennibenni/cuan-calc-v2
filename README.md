# 🪙 Cuan Calculator

> **Track and Forecast Your Gains Effortlessly** — A modern, mobile-first financial calculator suite and Progressive Web App (PWA) built for stock investors, traders, and personal finance management.

---

## ✨ Features & Tools

### 📈 Stock Investment
- **Profit & Loss** — Calculate potential profit or loss percentage and returns between buy and sell prices.
- **Take Profit & Stop Loss (TP/SL)** — Set target prices to secure profits or limit losses on trades.
- **Dividends** — Estimate expected dividend income from stock holdings based on lots, dividend per share (DPS), and tax rate.
- **Risk Management** — Calculate position sizing, risk/reward levels, and price targets.
- **Risk Management (%)** — Determine optimal risk percentage per trade based on portfolio size.
- **Compound Interest** — Project long-term investment growth with recurring contributions and compounding returns.

### 💼 Money Management
- **Deposit** — Calculate returns on fixed deposits with gross interest, tax deduction, and net yield.
- **Cashback Reward** — Estimate maximum rewards and compute minimum transaction thresholds needed for promotions.
- **Retirement** — Plan retirement savings goals and forecast projected nest egg based on current age, savings, and expected returns.

### 💱 Currency Converter & Utilities
- **Currency Converter** — Convert USD to IDR with live exchange rate integration.
- **Ratios** — Solve proportional relationships across four variables (solve for missing $a, b, c, d$).
- **Calculator** — Basic quick calculator with full keyboard shortcut support.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (with maskable adaptive icons & offline caching)
- **Testing**: [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/)
- **Code Quality**: ESLint, Prettier, Husky, Lint-Staged

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `^24` (Node.js 24 or newer recommended)
- **Package Manager**: [pnpm](https://pnpm.io/) (default), or `npm` / `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bennibennibenni/cuan-calc-v2.git
   cd cuan-calc-v2
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Vite development server with hot module replacement (HMR). |
| `pnpm build` | Type-checks with `tsc` and bundles production assets into `dist/`. |
| `pnpm preview` | Locally previews the production build. |
| `pnpm test` | Runs the test suite using Vitest. |
| `pnpm ts:check` | Runs the TypeScript compiler check without emitting files. |
| `pnpm lint` | Runs ESLint to check for code quality and formatting issues. |
| `pnpm lint:fix` | Automatically fixes fixable ESLint warnings and errors. |
| `pnpm format` | Formats all files using Prettier. |

---

## 📱 Progressive Web App (PWA)

Cuan Calculator is installable as a standalone app on iOS, Android, and desktop devices:
- **Mobile Adaptive Icons**: Includes W3C maskable icons with safe-zone margins for clean rendering on Android launchers (HyperOS, MIUI, One UI, Pixel Launcher) and iOS home screens.
- **Offline Ready**: Powered by Workbox service workers with runtime caching for fast loading even when offline.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
