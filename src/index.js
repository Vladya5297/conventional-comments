import { buttons as buttonsMeta } from './buttons.js'

const buttonClasses = [
  'toolbar-item',
  'tooltipped',
  'tooltipped-sw',
  'btn-octicon',
  'conventional-comment-button'
]

const buttons = buttonsMeta.reduce((result, { label, icon, hasBlocking }) => {
  const button = document.createElement('div')
  button.classList.add(...buttonClasses)
  button.setAttribute('data-comment', `**${label}:** `)
  button.setAttribute('aria-label', label)
  button.innerHTML = icon
  result.push(button)

  if (hasBlocking) {
    const blocking = button.cloneNode(true)
    button.setAttribute('data-comment', `**${label} (non-blocking):** `)
    blocking.setAttribute('data-comment', `**${label} (blocking):** `)

    blocking.classList.add('conventional-comment-blocking')
    blocking.setAttribute('aria-label', `${label} (blocking)`)
    result.push(blocking)
  }

  return result
}, [])

const wrapperClasses = [
  'border-md',
  'conventional-comment-wrapper'
]

const getValueWithComment = (comment, str) => {
  return comment + str.replace(/\*\*.+?\*\*\s/, '')
}

const process = (root) => {
  const textarea = root.querySelector('textarea')
  const buttonsWrapper = document.createElement('div')
  buttonsWrapper.classList.add(...wrapperClasses)
  buttons.forEach(button => {
    const clone = button.cloneNode(true)
    buttonsWrapper.appendChild(clone)
    clone.onclick = (e) => {
      e.preventDefault()
      const { comment } = button.dataset
      textarea.value = getValueWithComment(comment, textarea.value)
      textarea.focus()
    }
  })
  root.appendChild(buttonsWrapper)
  root.dataset.semanticButtonsInitialized = true
}

const ROOT_SELECTOR = 'file-attachment'

const run = () => {
  document
    .querySelectorAll(`${ROOT_SELECTOR}:not([data-semantic-buttons-initialized])`)
    .forEach(process)
}

const location = new URL(window.location.href)
if (
  location.hostname.startsWith('github') &&
  location.pathname.includes('pull')
) {
  setInterval(run, 300)
}
