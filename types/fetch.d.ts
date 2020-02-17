import {
  PostObject,
  TagsObject,
  AuthorsObject,
  PagesObject,
  SettingsObject
} from '@tryghost/content-api'

interface Resources {
  postObject: PostObject
  tagsObject: TagsObject
  pagesObject: PagesObject
  authorsObject: AuthorsObject
  settingsObject: SettingsObject
}
