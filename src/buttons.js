import * as icons from './icons.js'

const buttonsMeta = [
  {
    label: 'praise',
    icon: icons.praise
  },
  {
    label: 'suggestion',
    icon: icons.suggestion
  },
  {
    label: 'nitpick',
    icon: icons.nitpick,
    hasBlocking: true
  },
  {
    label: 'question',
    icon: icons.question,
    hasBlocking: true
  },
  {
    label: 'chore',
    icon: icons.chore,
    hasBlocking: true
  },
  {
    label: 'issue',
    icon: icons.issue
  },
  {
    label: 'thought',
    icon: icons.thought
  }
]

const buttonClassnames = [
  'toolbar-item',
  'tooltipped',
  'tooltipped-s',
  'btn-octicon',
  'conventional-comment-button'
]

const createButton = ({ comment, label, icon, onClick, classname }) => {
  const button = document.createElement('div')

  button.classList.add(...buttonClassnames)
  classname && button.classList.add(classname)

  // text to be inserted into textfield
  button.setAttribute('data-comment', comment)
  // text to be shown as tooltip
  button.setAttribute('aria-label', label)

  button.onclick = (e) => onClick(e, button)
  button.innerHTML = icon

  return button
}

export const getButtons = (onClick) => {
  return buttonsMeta.reduce((result, { label, icon, hasBlocking }) => {
    if (!hasBlocking) {
      const button = createButton({ comment: `**${label}:** `, label, icon, onClick })
      result.push(button)
      return result
    }

    const button = createButton({ comment: `**${label} (non-blocking):** `, label, icon, onClick })
    const blocking = createButton({
      comment: `**${label} (blocking):** `,
      classname: 'conventional-comment-blocking',
      label: `${label} (blocking)`,
      icon,
      onClick
    })

    result.push(button, blocking)
    return result
  }, [])
}
