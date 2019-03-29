<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.entries(brand).length > 0">
        <div
          v-for="key in Object.keys(brand)"
          :key="key"
          class="subheading"
        >
          <span>{{ key }}</span>: <span>{{ brand[key] }}</span>
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
      type: String
    }
  },
  data () {
    return {
      brand: {},
      buttonLoading: false
    }
  },
  created () {
    this.fetchBrand()
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'brands-list' }) }
      })
  },
  methods: {
    async fetchBrand () {
      const requestConfig = {
        method: 'get',
        url: `admin/brands/${this.routeKey}`
      }

      const response = await api.customRequest(requestConfig)
      this.brand = response.data.data
    },

    destroy () {
      if (confirm('Are you sure?')) {
        post.destroy(`admin/brands/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'brands-list' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    }
  }
}
</script>

<style scoped>

</style>
