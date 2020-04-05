import { mount } from '@vue/test-utils'
import { post, postWithFeatureImage } from '@/__tests__/fixtures/postOrPage'
import Author from '@/pages/author/_author.vue'
import { author } from '~/__tests__/fixtures/author'

describe('author page', () => {
  it('normal', () => {
    expect(
      mount(Author, {
        mocks: {
          posts: [post, postWithFeatureImage],
          author
        }
      })
    ).toMatchSnapshot()
  })
})
