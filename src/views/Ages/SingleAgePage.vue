<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.entries(age).length > 0">
        <div
          v-for="key in Object.keys(age)"
          :key="key"
          class="subheading"
        >
          <span>{{ key }}</span>: <span>{{ age[key] }}</span>
        </div>
      </template>
    </v-card-text>
    <v-card-actions class="pa-3">
      <v-spacer />
      <v-btn
        outline
        :loading="buttonLoading"
        :disabled="buttonLoading"
        color="red"
        @click.prevent="destroy"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import api from '@/services/api.service'
import post from '@/services/post.service'
export default {
  props: {
    routeKey: {
      required: true,
      type: [Number, String]
    }
  },
  data () {
    return {
      age: {},
      buttonLoading: false
    }
  },
  created () {
    this.fetchAge()
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'ages-list' }) }
      })
  },
  methods: {
    async fetchAge () {
      const requestConfig = {
        method: 'get',
        url: `admin/ages/${this.routeKey}`
      }

      const response = await api.customRequest(requestConfig)
      this.age = response.data.data
    },

    destroy () {
      if (confirm('Are you sure?')) {
        post.destroy(`admin/ages/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'ages-list' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    }
  }
}
</script>

<style scoped>

</style>
