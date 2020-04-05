import { mount } from '@vue/test-utils'
import AppHeader from '@/components/AppHeader.vue'

describe('AppHeader', () => {
  it('normal', () => {
    expect(
      mount(AppHeader, {
        propsData: {
          title: 'title',
          description: 'description'
        }
      }).element
    ).toMatchSnapshot()
  })

  it('with home button', () => {
    expect(
      mount(AppHeader, {
        propsData: {
          homeButton: true
        }
      }).element
    ).toMatchSnapshot()
  })

  it('override default slot', () => {
    expect(
      mount(AppHeader, {
        slots: {
          default: 'default slot'
        }
      }).element
    ).toMatchSnapshot()
  })

  it('put footer slot', () => {
    expect(
      mount(AppHeader, {
        slots: {
          footer: 'footer'
        }
      }).element
    ).toMatchSnapshot()
  })

  it('override cover', () => {
    expect(
      mount(AppHeader, {
        propsData: {
          cover: 'passCoverViaProps.png'
        }
      }).element
    ).toMatchSnapshot()
  })
})
