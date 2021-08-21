import { buttons as btnConfigs } from './buttons.js'

const buttonClass = [
  'toolbar-item',
  'tooltipped',
  'tooltipped-sw',
  'conventional-comment-button'
]

const buttons = btnConfigs.reduce((result, { label, icon, hasBlocking }) => {
  const button = document.createElement('div')
  button.classList.add(...buttonClass)
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

const getValueWithComment = (comment, str) => {
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
      const { comment } = button.dataset
      textarea.value = getValueWithComment(comment, textarea.value)
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
