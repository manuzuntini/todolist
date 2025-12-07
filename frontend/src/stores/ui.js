import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    dark: false
  }),
  actions: {
    toggleTheme() { this.dark = !this.dark }
  }
})
