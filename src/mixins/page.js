import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      pageLoading: 'page/pageLoading'
    })
  },
  methods: {
    ...mapActions({
      setPageLoading: 'page/setPageLoading',
      setPageReady: 'page/setPageReady'
    })
  }
}
