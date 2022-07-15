/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `components/**/*.{vue,js}`,
    `assets/**/*.{vue,js}`,
    `layout/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,    
    `plugins/**/*.{js,ts}`,    
    `App.{js,ts,vue}`,    
    `app.{js,ts,vue}`
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
