import { buttons as btnConfigs } from './buttons.js'

const buttonClasses = [
  'toolbar-item',
  'tooltipped',
  'tooltipped-sw',
  'conventional-comment-button'
]

const buttons = btnConfigs.reduce((result, { label, icon, hasBlocking }) => {
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

const process = (form) => {
  if (!form.offsetParent) {
    return
  }
  const textarea = form.querySelector('textarea')

  const wrapper = document.createElement('div')
  wrapper.classList.add(...wrapperClasses)
  buttons.forEach(button => {
    const copy = button.cloneNode(true)
    wrapper.appendChild(copy)
    copy.onclick = (e) => {
      e.preventDefault()
      const { comment } = button.dataset
      textarea.value = getValueWithComment(comment, textarea.value)
      textarea.focus()
    }
  })
  form.appendChild(wrapper)

  form.dataset.semanticButtonsInitialized = 'true'
}

const run = () => {
  document
    .querySelectorAll('form tab-container:not([data-semantic-buttons-initialized])')
    .forEach(process)
}

const location = new URL(window.location.href)
if (
  location.hostname.startsWith('github') &&
  location.pathname.includes('pull')
) {
  setInterval(run, 300)
}
