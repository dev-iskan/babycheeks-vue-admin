<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.keys(category).length">
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
          <span>parent</span>: <span>{{ category.parent }}</span>
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
import crud from '@/services/crud.service'
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
    crud.fetchSingle('admin/categories', this.routeKey)
      .then(category => { this.category = category })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'categories.index' }) }
      })
  },
  methods: {
    destroy () {
      if (confirm('Are you sure?')) {
        crud.destroy(`admin/categories/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'categories.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    }
  }
}
</script>

<style scoped>

</style>
