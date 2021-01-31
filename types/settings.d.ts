declare module '~/.data/settings.json' {
  import { SettingsResponse } from '@tryghost/content-api'
  const value: SettingsResponse
  export default value
}
