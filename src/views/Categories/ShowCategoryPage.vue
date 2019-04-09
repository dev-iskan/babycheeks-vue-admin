<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text class="category__body">
      <template
        v-if="Object.keys(category).length"
      >
        <div class="body__product-description">
          <div class="subheading d-flex table">
            <div class="d-flex width-50 text-uppercase">
              id
            </div>
            <div class="d-flex">
              {{ category.id }}
            </div>
          </div>
          <div class="subheading d-flex table">
            <div class="d-flex width-50 text-uppercase">
              name
            </div> <div class="d-flex">
              {{ category.name }}
            </div>
          </div>
          <div class="subheading d-flex table">
            <div class="d-flex width-50 text-uppercase">
              description
            </div>

            <div
              class="d-flex width-50 body-2"
              v-html="category.description"
            />
          </div>
          <div class="subheading d-flex table">
            <div class="d-flex width-50 text-uppercase">
              parent
            </div> <div class="d-flex width-50">
              {{ category.parent }}
            </div>
          </div>
          <div class="subheading d-flex table">
            <div class="d-flex width-50 text-uppercase">
              created at
            </div> <div class="d-flex width-50">
              {{ category.created_at }}
            </div>
          </div>
        </div>
      </template>
      <template
        v-if="category.image"
        class="body__product-image"
      >
        <v-img
          :src="category.image"
          height="200"
        />
      </template>
    </v-card-text>
    <v-card-actions class="pa-3">
      <v-spacer />
      <v-btn
        outline
        color="primary"
        @click.prevent="edit"
      >
        Edit
      </v-btn>
      <v-btn
        outline
        :loading="buttonLoading"
        color="secondary"
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
    },
    edit () {
      this.$router.push({ name: 'categories.edit', params: { routeKey: this.routeKey } })
    }
  }
}
</script>

<style scoped>

</style>
