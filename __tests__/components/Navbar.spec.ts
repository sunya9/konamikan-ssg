import { mount } from '@vue/test-utils'
import NavBar from '@/components/NavBar.vue'

describe('NavBar', () => {
  it('normal', () => {
    expect(mount(NavBar)).toMatchSnapshot()
  })

  it('with home button', () => {
    expect(
      mount(NavBar, {
        propsData: {
          homeButton: true
        }
      })
    ).toMatchSnapshot()
  })
})
