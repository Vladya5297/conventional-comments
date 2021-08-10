;(async () => {
  const src = chrome.runtime.getURL('src/app.js')
  const app = await import(src)
  setInterval(app.run, 300)
})()
