import colors from 'colors/safe'

export class Logger {
  log (...data: any[]): void {
    console.log(`[ImageAPI] ${colors.green('[Log  ]')}`, ...data)
  }

  warn (...data: any[]): void {
    console.warn(`[ImageAPI] ${colors.yellow('[Warn ]')}`, ...data)
  }

  error (...data: any[]): void {
    console.log(`[ImageAPI] ${colors.red('[Error]')}`, ...data)
  }

  debug (...data: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ImageAPI] ${colors.magenta('[Debug]')}`, ...data)
    }
  }
}
