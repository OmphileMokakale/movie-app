import { defineConfig } from 'vite'
import mix from 'vite-plugin-mix' 

export default defineConfig({
    base: 'movie-app',
    plugins: [
        mix({
          handler: './api.js',
        }),
      ],
})