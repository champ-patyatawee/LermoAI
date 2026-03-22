/// <reference types="vite/client" />

declare module 'reveal.js' {
  interface RevealOptions {
    hash?: boolean
    slideNumber?: boolean | string
    transition?: string
    backgroundTransition?: string
    embedded?: boolean
    plugins?: unknown[]
  }

  class Reveal {
    constructor(element: HTMLElement | string, options?: RevealOptions)
    initialize(): Promise<void>
    destroy(): void
    sync(): void
    next(): void
    prev(): void
    getIndices(): { h: number; v: number }
  }

  export default Reveal
}

declare module 'reveal.js/plugin/markdown/markdown' {
  const Markdown: {
    [key: string]: any
  }
  export default Markdown
}
