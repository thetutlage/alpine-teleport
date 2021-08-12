import teleport from './teleport.js'

document.addEventListener('alpine:init', () => {
  window.Alpine.plugin(teleport)
})
