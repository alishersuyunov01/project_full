# 🌟 Kervan — Uzbekistan's Intercity Ride Network

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20%2F%20Production%20Ready-success?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Architecture-Pure%20Front--End-orange?style=for-the-badge" alt="Architecture">
  <img src="https://img.shields.io/badge/Design-Premium%20%26%20Oriental%20Luxury-gold?style=for-the-badge&color=C9A84C" alt="Design">
</p>

---
## This Project link
https://alishersuyunov01.github.io/project_full/

## 📌 Project Overview

**Kervan** is a conceptual, premium web platform designed to seamlessly coordinate intercity travels between Uzbekistan's historic and modern hubs (Tashkent, Samarkand, Bukhara, Khiva, Andijan, Termez, and more). Inspired by the heritage of the ancient Silk Road caravans, the platform delivers a high-end digital ecosystem by balancing elegant oriental aesthetics with state-of-the-art visual engineering.

The application serves two distinct user layers:
1.  **Passenger Portal (`passenger.html`):** Ride configuration, instant tariff selection, promo code validation, and real-time algorithmic fare estimation.
2.  **Driver Portal (`driver.html`):** Interactive order dispatch dashboard, live earnings analytics, performance metrics, and shift availability management.

---

## 🛠️ Complete Technology Stack

To ensure lightning-fast performance, zero dependency lag, and cross-browser reliability, the project is architected entirely on a **Pure Vanilla Front-End Stack**:

* **HTML5 (HyperText Markup Language):** Structured using semantic elements (`<section>`, `<nav>`, `<aside>`, `<main>`) ensuring clean DOM layouts, robust form management, native interactive input controls, and scalable modal nodes.
* **CSS3 (Cascading Style Sheets):** Engineered with modern specifications, including global custom properties (`CSS Variables`), flexible container structures (`Flexbox` & `CSS Grid`), complex keyframe animations, micro-interactions, and comprehensive media queries for fluid responsiveness.
* **JavaScript (Native ES6+):** Orchestrates core client-side operations, lifecycle management, an asynchronous-style dynamic localization engine, mathematical fare computation algorithms, real-time UI state manipulation, and persistent storage synchronization.

---

## 🎨 Visual Style & Advanced Design System

The application is built upon a custom-tailored **"Oriental Dark Luxury"** design spec, capturing the atmosphere of a star-lit desert night combined with majestic historic craftsmanship.

### 1. Color Palette Matrix (`CSS Variables`)
* `--dark` & `--ink` (`#1A1209`): Represents the deep midnight sky over Central Asia. Serves as the primary dark-mode canvas.
* `--gold`, `--gold-light`, `--gold-dark` (`#C9A84C`): Evokes the luxury, historical wealth, and ornate elements of Silk Road trade hubs. Used exclusively for core brand accents, borders, and active highlights.
* `--cream` & `--sand` (`#F5EDD6`): Inspired by ancient parchment manuscripts. Provides an ultra-legible, eye-soothing contrast for text readability and layout containers.
* `--teal` (`#1A6B6B`) & `--rust` (`#B54521`): Contextual action tokens referencing traditional oriental turquoise pottery and copper crafts, utilized for secondary validation and alert triggers.

### 2. Typographical Heritage
* **Display & Headings:** Styled via the `Cinzel` font family — an epic, sharp serif typeface that infuses a sense of timeless, monumental scale.
* **Interface & Reading Canvas:** Managed via the `Outfit` font family — a contemporary geometric sans-serif optimized for crisp rendering across high-density mobile displays.

### 3. Visual FX and Layout Methodologies
* **Glassmorphic Overlays:** Dialog boxes and dashboard cards utilize frosted alpha backdrops (`rgba`), subtle glowing strokes (`border: 1px solid rgba(201, 168, 76, 0.2)`), and multi-layered backdrop filters to establish depth.
* **Procedural Starry Sky (`#splash-stars`):** The introductory screen features an algorithmic particle populator that instantiates a randomized cluster of glowing stars using runtime coordinate generation and asynchronous pulsing animations.
* **Custom Form Override:** Standalone system checkboxes, select drop-downs, sliders, and binary on/off switches (`toggle elements`) have been completely redesigned from native browser specifications to align with the overarching premium theme.

---

## ⚙️ Core Logic & Algorithmic Engineering

### 🗺️ Intercity Distance Matrix
The system avoids expensive external map API calls by keeping an internally mapped geographical distance and estimated time of arrival (ETA) data matrix modeled inside `script.js`:
```javascript
const routeDistances = {
  'tashkent-samarkand': 340, // 340 kilometers
  'tashkent-bukhara': 560,   // 560 kilometers
  'samarkand-bukhara': 270,  // 270 kilometers
  // ... fully scalable dictionary array
};
