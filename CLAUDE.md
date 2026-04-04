# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `pnpm`. Always use `pnpm` instead of `npm`.

- `pnpm run dev` - Start development server on port 3000
- `pnpm run build` - Build production bundle
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

## Project Overview

This is a Next.js 16 demo application for **Credit & Share**, a dual-asset RWA (Real World Asset) platform. The app demonstrates a consumption-to-accumulation model where users earn Credits by consuming at merchants, then stake Credits to obtain Shares, and receive earnings based on their Share holdings.

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom Material Design-inspired theme
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **TypeScript**: Strict mode enabled

## Architecture

### App Structure (App Router)

```
app/
├── layout.tsx          # Root layout with Header
├── page.tsx            # Landing page (hero + metrics)
├── dashboard/page.tsx  # Asset dashboard with charts
├── merchants/page.tsx  # Merchant list with order creation
└── stake/page.tsx      # Credit staking interface
```

### Global State Management (`lib/store.ts`)

The Zustand store manages all application state:

- **User State**: `address`, `credit`, `share`, `earnings`
- **Orders**: Array of completed/pending orders
- **Activities**: Array of user activity events

**Store Actions**:
- `consumeAtMerchant(merchantId, merchantName, amount)` - Creates order, earns credit (1:10 ratio)
- `stakeCredit(amount)` - Converts credit to share (1:1 ratio)
- `sellShare(amount, price)` - Sells shares for earnings
- `buyShare(orderId, amount, price)` - Buys shares from market

### Mock Data (`lib/mock-data.ts`)

All data is currently mocked. Contains:
- `mockMerchants` - Available merchants
- `mockUserInitial` - Initial user state
- `mockOrdersInitial` - Initial orders
- `mockActivitiesInitial` - Initial activities
- `mockMarketData` - Market data for Share trading
- `mockEarningsHistory` - Historical earnings for charts
- `mockMetrics` - Platform-wide metrics for landing page

### Component Architecture

**Layout Component**:
- `components/Header.tsx` - Sticky navigation with wallet connection display

**Shared Components**:
- `components/Button.tsx` - Material Design 3 styled buttons (filled, outlined, tonal variants)
- `components/Card.tsx` - Container component with optional hover state

**Feature Components**:
- `components/AssetCard.tsx` - Display user assets (Credit, Share, Earnings)
- `components/MerchantCard.tsx` - Display merchant info with consume action
- `components/OrderModal.tsx` - Modal for creating orders at merchants
- `components/EarningsChart.tsx` - Line chart showing earnings history
- `components/ActivityList.tsx` - List of user activities
- `components/StakeForm.tsx` - Form for staking Credit to Share

## Design System

The app uses a custom Material Design 3-inspired theme defined in `app/globals.css`:

**Color Palette** (all CSS variables prefixed with `--color-md-`):
- `primary` (#6750a4) - Primary actions, links
- `secondary-container` (#e8def8) - Active navigation states
- `tertiary` (#7d5260) - Accent color
- `surface-container` (#f3edf7) - Card backgrounds
- `surface-container-low` (#e7e0ec) - Section backgrounds
- `success` (#10b981) - Success states
- `error` (#ef4444) - Error states

**Typography**: Roboto font (weights 400, 500, 700)

**Animations**: Custom `fadeIn` and `scaleIn` keyframes defined in globals.css

## Key Patterns

1. **Client Components**: All page components use `'use client'` directive due to state management and interactivity
2. **Framer Motion**: Most components use motion wrappers for entrance animations (opacity/transform)
3. **Date Formatting**: Uses `toLocaleString('zh-CN')` for Chinese locale date formatting
4. **State Updates**: All state mutations happen through Zustand store actions
5. **Responsive Design**: Mobile-first with `md:` breakpoints for desktop layouts

## Language & Localization

- **App Language**: Chinese (Simplified)
- **Date Locale**: `zh-CN`
- All UI text is in Chinese

## Git & Deployment

**Remote Repositories**:
- `origin` → https://github.com/BI4O/WinPoint.git (主仓库，默认 push 目标)
- `winpoint` → https://github.com/BI4O/WinPoint.git (备用，同一个仓库)

**Push 规则**:
- 推送到 `origin` 时，默认推送到当前分支（win1）
- **重要**: 推送到 `origin` 的 `win1` 分支时，需要同时 push 到 WinPoint 的 `main` 分支：
  ```bash
  git push origin win1 && git push origin win1:main
  ```
- 或者单独推送到 WinPoint main：
  ```bash
  git push origin win1:main
  ```

## Import Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`)
