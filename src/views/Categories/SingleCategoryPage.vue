<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.entries(category).length > 0">
        <div class="subheading">
          <span>id</span>: <span>{{ category.id }}</span>
        </div>
        <div class="subheading">
          <span>name</span>: <span>{{ category.name }}</span>
        </div>
        <div class="subheading">
          <span>description</span>: <div v-html="category.description" />
        </div>
        <div class="subheading">
          <span>created at</span>: <span>{{ category.created_at }}</span>
        </div>
        <template v-if="category.image">
          <v-img
            :src="category.image"
            max-width="500"
          />
        </template>
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
      category: {},
      buttonLoading: false
    }
  },
  created () {
    this.fetchCategory()
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'categories-list' }) }
      })
  },
  methods: {
    async fetchCategory () {
      const requestConfig = {
        method: 'get',
        url: `admin/categories/${this.routeKey}`
      }

      const response = await api.customRequest(requestConfig)
      this.category = response.data.data
    },

    destroy () {
      if (confirm('Are you sure?')) {
        post.destroy(`admin/categories/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'categories-list' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    }
  }
}
</script>

<style scoped>

</style>
