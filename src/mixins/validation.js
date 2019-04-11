import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      errors: 'validation/errors'
    })
  }
}
