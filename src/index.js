import { getButtons } from './buttons.js'

const wrapperClasses = [
  'border',
  'conventional-comment-wrapper'
]

const getValueWithComment = (comment, str) => {
  return comment + str.replace(/\*\*.+?\*\*\s/, '')
}

const process = (textarea) => {
  const root = textarea.closest('file-attachment')

  const buttonsWrapper = document.createElement('div')
  buttonsWrapper.classList.add(...wrapperClasses)

  const onClick = (e, button) => {
    e.preventDefault()
    const { comment } = button.dataset
    textarea.value = getValueWithComment(comment, textarea.value)
    textarea.focus()
  }
  const buttons = getButtons(onClick)
  buttons.forEach(button => { buttonsWrapper.appendChild(button) })

  root.appendChild(buttonsWrapper)
  textarea.dataset.semanticButtonsInitialized = true
}

const TEXTAREA_SELECTOR = 'textarea[placeholder="Leave a comment"]'

const run = () => {
  document
    .querySelectorAll(`${TEXTAREA_SELECTOR}:not([data-semantic-buttons-initialized])`)
    .forEach(process)
}

const location = new URL(window.location.href)
if (
  location.hostname.startsWith('github') &&
  location.pathname.includes('pull')
) {
  run()
  document.addEventListener('click', run)
}
