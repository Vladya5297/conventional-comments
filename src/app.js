import { buttons as btnConfigs } from './buttons.js'
import * as icons from './icons.js'

const buttonClass = [
  'toolbar-item',
  'tooltipped',
  'tooltipped-sw',
  'conventional-comment-button'
]

const buttons = Object.entries(btnConfigs).reduce((result, [title, { label, hasBlocking }]) => {
  const button = document.createElement('div')
  button.classList.add(...buttonClass)
  button.setAttribute('data-decorator', '')
  button.setAttribute('data-title', title)
  button.setAttribute('aria-label', label)
  button.innerHTML = icons[title]
  result.push(button)

  if (hasBlocking) {
    const blocking = button.cloneNode(true)
    button.setAttribute('data-decorator', ' (non-blocking)')
    blocking.setAttribute('data-decorator', ' (blocking)')

    blocking.classList.add('conventional-comment-blocking')
    blocking.setAttribute('aria-label', `${label} (blocking)`)
    result.push(blocking)
  }

  return result
}, [])

const getValueWithComment = (title, decorator, str) => {
  const comment = `**${title}${decorator}:** `
  return comment + str.replace(/\*\*.+?\*\*\s/, '')
}

const process = (form) => {
  if (!form.offsetParent) {
    return
  }
  const textarea = form.querySelector('textarea')

  const wrapper = document.createElement('div')
  wrapper.classList.add('conventional-comment-wrapper')
  buttons.forEach(button => {
    const copy = button.cloneNode(true)
    wrapper.appendChild(copy)
    copy.onclick = (e) => {
      e.preventDefault()
      const { title, decorator } = button.dataset
      textarea.value = getValueWithComment(title, decorator, textarea.value)
      textarea.focus()
    }
  })
  form.appendChild(wrapper)

  form.dataset.semanticButtonInitialized = 'true'
}

export const run = () => {
  document.querySelectorAll('tab-container:not([data-semantic-button-initialized])')
    .forEach(process)
}
