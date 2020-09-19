import { mount } from '@vue/test-utils'
import Fuse from 'fuse.js'
import MatchedText from '@/components/MatchedText'

describe('MatchedText', () => {
  it('normal', () => {
    const matches: Fuse.FuseResultMatch[] = [
      {
        key: 'test',
        refIndex: 1,
        value: 'lorem ipsum',
        indices: [[0, 4]]
      }
    ]
    const wrapper = mount(MatchedText, {
      propsData: {
        matches
      }
    })
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.text()).toBe('lorem ipsum')
    expect(wrapper.find('mark').text()).toBe('lorem')
  })
})
