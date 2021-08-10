import { buttons as btnConfigs } from './buttons.js'
import * as icons from './icons.js'

const upperFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

const buttonClass = [
  'toolbar-item',
  'tooltipped',
  'tooltipped-sw',
  'conventional-comment-button'
]

const buttons = Object.values(btnConfigs).reduce((result, { title, hasBlocking }) => {
  const button = document.createElement('div')
  button.classList.add(...buttonClass)
  button.setAttribute('data-title', title)
  button.setAttribute('aria-label', upperFirst(title))
  button.innerHTML = icons[title]
  result.push(button)

  if (hasBlocking) {
    const blocking = button.cloneNode(true)
    blocking.classList.add('conventional-comment-blocking')
    blocking.setAttribute('data-blocking', true)
    blocking.setAttribute('aria-label', `${upperFirst(title)} (blocking)`)
    result.push(blocking)
  }

  return result
}, [])

const getValueWithComment = (title, blocking, str) => {
  const decorator = !btnConfigs[title].hasBlocking ? '' : blocking ? ' (blocking)' : ' (non-blocking)'
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
      textarea.value = getValueWithComment(title, blocking, textarea.value)
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
