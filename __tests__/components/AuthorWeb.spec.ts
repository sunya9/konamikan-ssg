import { mount } from '@vue/test-utils'
import { author } from '@/__tests__/fixtures/author'
import AuthorWeb from '@/components/AuthorWeb.vue'

describe('AuthorWeb', () => {
  it('normal', () => {
    expect(
      mount(AuthorWeb, {
        propsData: {
          author
        }
      })
    ).toMatchSnapshot()
  })

  it('override text color', () => {
    expect(
      mount(AuthorWeb, {
        propsData: {
          author,
          color: 'has-text-white'
        }
      })
    ).toMatchSnapshot()
  })

  it('override size', () => {
    expect(
      mount(AuthorWeb, {
        propsData: {
          author,
          size: 'is-normal'
        }
      })
    ).toMatchSnapshot()
  })
})
