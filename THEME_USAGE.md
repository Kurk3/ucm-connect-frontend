# 🎨 Dark/Light Mode Theme System - Usage Guide

## Overview

Your application now has a fully functional dark/light mode theme system that integrates:
- **Tailwind CSS** dark mode utilities
- **PrimeVue** theme system
- **Vue composable** for state management
- **Custom opacity colors** for parent/child components

---

## ✅ What's Been Implemented

### 1. **Tailwind Config** (`tailwind.config.js`)
- ✅ Enabled `darkMode: 'class'`
- ✅ Added custom colors:
  - `parent-light` / `parent-dark` (40% opacity)
  - `child-light` / `child-dark` (20% opacity)

### 2. **Theme Composable** (`src/composables/useTheme.ts`)
- ✅ Global state management for theme
- ✅ LocalStorage persistence
- ✅ System preference detection
- ✅ Syncs with both Tailwind and PrimeVue

### 3. **Theme Toggle Component** (`src/components/ThemeToggle.vue`)
- ✅ Beautiful toggle button with moon/sun icons
- ✅ Smooth transitions
- ✅ Integrated in Header component

### 4. **Dark Mode Styles** (`src/assets/index.css`)
- ✅ Dark gradient background for body
- ✅ Dark mode scrollbar styles

---

## 🚀 How to Use in Your Components

### Method 1: Using Tailwind Opacity Utilities (Recommended)

This is the most flexible approach:

```vue
<template>
  <!-- Parent component with 40% opacity -->
  <div class="bg-white/70 dark:bg-black/50 rounded-2xl p-6">
    <h2 class="text-gray-900 dark:text-white">Parent Container</h2>
    
    <!-- Child component with 20% opacity -->
    <div class="bg-white/20 dark:bg-black/20 rounded-lg p-4">
      <p class="text-gray-700 dark:text-gray-200">Child Element</p>
    </div>
  </div>
</template>
```

### Method 2: Using Custom Color Classes

```vue
<template>
  <!-- Parent component -->
  <div class="bg-parent dark:bg-parent-dark rounded-2xl p-6">
    <h2>Parent Container</h2>
    
    <!-- Child component -->
    <div class="bg-child dark:bg-child-dark rounded-lg p-4">
      <p>Child Element</p>
    </div>
  </div>
</template>
```

### Method 3: Using Named Colors for Better Semantics

```vue
<template>
  <!-- Parent component -->
  <div class="bg-parent-light dark:bg-parent-dark rounded-2xl p-6">
    <h2>Parent Container</h2>
    
    <!-- Child component -->
    <div class="bg-child-light dark:bg-child-dark rounded-lg p-4">
      <p>Child Element</p>
    </div>
  </div>
</template>
```

---

## 📝 Example: Updating Existing Components

### Before (Sidebar.vue):
```vue
<aside class="bg-white p-6 lg:p-8 rounded-2xl">
  <div class="border border-gray-200 rounded-lg p-4">
    <ul class="text-gray-700">
      <!-- content -->
    </ul>
  </div>
</aside>
```

### After (With Dark Mode):
```vue
<aside class="bg-white/70 dark:bg-black/50 p-6 lg:p-8 rounded-2xl">
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white/20 dark:bg-black/20">
    <ul class="text-gray-700 dark:text-gray-200">
      <!-- content -->
    </ul>
  </div>
</aside>
```

### Before (MainContent.vue):
```vue
<section class="bg-white p-6 lg:p-8 rounded-2xl">
  <h2 class="text-gray-500">Vyber si kategóriu</h2>
</section>
```

### After (With Dark Mode):
```vue
<section class="bg-white/70 dark:bg-black/50 p-6 lg:p-8 rounded-2xl">
  <h2 class="text-gray-500 dark:text-gray-300">Vyber si kategóriu</h2>
</section>
```

---

## 🎯 Common Dark Mode Patterns

### Text Colors
```vue
<!-- Regular text -->
<p class="text-gray-700 dark:text-gray-200">Normal text</p>

<!-- Headings -->
<h1 class="text-gray-900 dark:text-white">Heading</h1>

<!-- Muted text -->
<span class="text-gray-500 dark:text-gray-400">Muted text</span>
```

### Borders
```vue
<div class="border border-gray-200 dark:border-gray-700">
  <!-- content -->
</div>
```

### Hover States
```vue
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">
  Hover me
</button>
```

### Icons
```vue
<i class="pi pi-home text-gray-700 dark:text-gray-200"></i>
```

---

## 🔧 Accessing Theme State in Components

If you need to programmatically check or change the theme:

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, setTheme } = useTheme()

// Check if dark mode is active
console.log(isDark.value) // true or false

// Toggle theme
const handleToggle = () => {
  toggleTheme()
}

// Set specific theme
const enableDarkMode = () => {
  setTheme(true)
}

const enableLightMode = () => {
  setTheme(false)
}
</script>

<template>
  <div>
    <p v-if="isDark">Dark mode is active</p>
    <p v-else>Light mode is active</p>
    
    <button @click="handleToggle">Toggle Theme</button>
  </div>
</template>
```

---

## 🎨 Color Palette Reference

### Custom Theme Colors
- `bg-parent` → `rgba(255, 255, 255, 0.4)` (white 40%)
- `bg-child` → `rgba(255, 255, 255, 0.2)` (white 20%)
- `bg-parent-dark` → `rgba(0, 0, 0, 0.4)` (black 40%)
- `bg-child-dark` → `rgba(0, 0, 0, 0.2)` (black 20%)

### Tailwind Opacity Syntax
- `bg-white/70` → white with 40% opacity
- `bg-white/20` → white with 20% opacity
- `bg-black/40` → black with 40% opacity
- `bg-black/20` → black with 20% opacity

---

## 🌈 Background Gradients

The body has animated gradients that automatically switch in dark mode:

**Light Mode:**
```css
linear-gradient(-45deg, #23a6d5, #23d5ab, #7195FF, #445999)
```

**Dark Mode:**
```css
linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483)
```

---

## 🔄 How It Works

1. **Theme Toggle Button** → User clicks the moon/sun icon
2. **useTheme Composable** → Updates `isDark` reactive state
3. **DOM Classes Updated** → Adds/removes `.dark` and `.my-app-dark` classes on `<html>`
4. **Tailwind Applies Styles** → All `dark:` utility classes activate
5. **PrimeVue Updates** → PrimeVue components automatically theme themselves
6. **LocalStorage** → Theme preference saved for next visit

---

## 📦 What's Included

✅ Theme toggle button in Header  
✅ Automatic system theme detection  
✅ LocalStorage persistence  
✅ Smooth transitions  
✅ PrimeVue integration  
✅ Custom opacity colors  
✅ Dark gradient backgrounds  

---

## 🎬 Next Steps

1. **Update your existing components** to use dark mode classes
2. **Test the theme toggle** to see it in action
3. **Customize colors** in `tailwind.config.js` if needed
4. **Add dark mode to forms** and other interactive elements

---

## 💡 Pro Tips

- Use `dark:` prefix for any Tailwind utility class
- Prefer opacity utilities (`/40`, `/20`) for glass-morphism effects
- Use `backdrop-blur-sm` with opacity backgrounds for better visual depth
- Test both themes to ensure good contrast and readability
- PrimeVue components automatically adapt to dark mode

---

## 🐛 Troubleshooting

**Dark mode not working?**
- Check that `darkMode: 'class'` is in `tailwind.config.js`
- Verify the `.dark` class is on the `<html>` element when toggled
- Make sure you're using the `dark:` prefix in your classes

**Theme not persisting?**
- Check browser console for localStorage errors
- Ensure `initTheme()` is called in `App.vue` on mount

**PrimeVue components not theming?**
- Verify `my-app-dark` class is added alongside `.dark` class
- Check that PrimeVue config in `main.ts` has `darkModeSelector: '.my-app-dark'`

---

Enjoy your new dark mode! 🌙✨

