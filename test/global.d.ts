declare global {
  var testAccessibility: (container: HTMLElement) => Promise<any>
  var mockScreenReader: {
    announcements: string[]
    announce: (message: string) => void
    clear: () => void
  }
}

export {}