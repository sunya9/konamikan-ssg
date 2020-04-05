import { mount } from '@vue/test-utils'
import { post } from '@/__tests__/fixtures/postOrPage'
import PostsGroupedByYear from '@/components/PostsGroupedByYear.vue'

describe('PostsGroupedByYear', () => {
  it('normal', () => {
    expect(
      mount(PostsGroupedByYear, {
        propsData: {
          posts: [post],
          year: 2020
        }
      })
    ).toMatchSnapshot()
  })
})
