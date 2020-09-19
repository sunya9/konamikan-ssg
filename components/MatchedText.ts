import Vue, { PropOptions } from 'vue'
import Fuse from 'fuse.js'
import unicodeSubstring from 'unicode-substring'
export default Vue.extend({
  name: 'MatchedText',
  functional: true,
  props: {
    matches: {
      type: Array,
      required: true
    } as PropOptions<Fuse.FuseResultMatch[]>
  },
  render(h, context) {
    const match = context.props.matches[0]
    const [start, originalEnd] = match.indices[0]
    const end = originalEnd + 1
    const { value } = match
    if (!value) return h('span')
    const endOffset = start + 30 < value.length ? end + 30 : value.length
    const suffix = unicodeSubstring(value, end, endOffset)
    const mark = h('mark', unicodeSubstring(value, start, end))
    return h(
      'p',
      {
        staticClass: 'is-text-truncated'
      },
      [mark, suffix]
    )
  }
})
