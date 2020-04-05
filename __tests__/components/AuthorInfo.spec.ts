import { mount } from '@vue/test-utils'
import { author } from '@/__tests__/fixtures/author'
import AuthorInfo from '@/components/AuthorInfo.vue'

describe('AuthorInfo', () => {
  it('normal', () => {
    expect(
      mount(AuthorInfo, {
        propsData: {
          author
        }
      })
    ).toMatchSnapshot()
  })
})
