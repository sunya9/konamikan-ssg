import { mount } from '@vue/test-utils'
import { post } from '@/__tests__/fixtures/postOrPage'
import Posts from '@/components/Posts.vue'

describe('Posts', () => {
  it('normal', () => {
    expect(
      mount(Posts, {
        propsData: {
          posts: [post]
        }
      })
    ).toMatchSnapshot()
  })
})
