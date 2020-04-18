type Data = { url: string } | { text: string } | { title: string }
declare global {
  interface Navigator {
    share(data: Data): Promise<void>
  }
}

export {}
