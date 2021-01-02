import { mount } from '@vue/test-utils'
import { PostOrPage } from '@tryghost/content-api'
import { post } from '@/__tests__/fixtures/postOrPage'
import Article from '@/pages/blog/_slug.vue'

describe('article page', () => {
  it('normal', () => {
    const newerPost: PostOrPage = { ...post, title: 'newerPost' }
    const olderPost: PostOrPage = { ...post, title: 'olderPost' }
    expect(
      mount(Article, {
        mocks: {
          post,
          newerPost,
          olderPost
        }
      })
    ).toMatchSnapshot()
  })
})
