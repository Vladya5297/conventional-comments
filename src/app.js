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
  button.setAttribute('data-title', title)
  button.setAttribute('aria-label', label)
  button.innerHTML = icons[title]
  result.push(button)

  if (hasBlocking) {
    const blocking = button.cloneNode(true)
    blocking.classList.add('conventional-comment-blocking')
    blocking.setAttribute('data-blocking', true)
    blocking.setAttribute('aria-label', `${label} (blocking)`)
    result.push(blocking)
  }

  return result
}, [])

const getDecorator = (title, blocking) => !btnConfigs[title].hasBlocking ? '' : blocking ? ' (blocking)' : ' (non-blocking)'

const getValueWithComment = (title, decorator, str) => {
  const comment = `**${title}${decorator}:** `
  return comment + str.replace(/\*\*.+?\*\*\s/, '')
}

const process = (form) => {
  const textarea = form.querySelector('textarea')
  const toolbar = form.querySelector('markdown-toolbar')
  const wrapper = document.createElement('div')
  wrapper.classList.add('conventional-comment-wrapper')
  buttons.forEach(button => {
    button.onclick = (e) => {
      e.preventDefault()
      const { title, blocking } = button.dataset
      const decorator = getDecorator(title, blocking)
      textarea.value = getValueWithComment(title, decorator, textarea.value)
    }
    wrapper.appendChild(button)
  })
  toolbar.appendChild(wrapper)
}

export const run = () => {
  document.querySelectorAll('.js-new-comment-form:not([data-semantic-button-initialized])')
    .forEach(form => {
      form.dataset.semanticButtonInitialized = 'true'
      process(form)
    })
}
