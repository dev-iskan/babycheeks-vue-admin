<template>
  <v-snackbar
    bottom
    right
    :value="message"
    color="deep-purple lighten-3"
    @input="closeSnack"
  >
    <v-flex
      class="text-xs-center title"
    >
      {{ message }}
    </v-flex>
  </v-snackbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      message: 'status/message'
    })
  },
  methods: {
    ...mapActions({
      clearMessage: 'status/clearMessage'
    }),
    closeSnack (value) {
      if (!value) {
        this.clearMessage()
      }
    }
  }
}
</script>

<style scoped>

</style>
