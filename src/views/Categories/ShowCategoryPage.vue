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
        color="blue"
        @click.prevent="edit"
      >
        Edit
      </v-btn>
      <v-btn
        outline
        :loading="buttonLoading"
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
    },
    edit () {
      this.$router.push({ name: 'categories.edit', params: { routeKey: this.routeKey } })
    }
  }
}
</script>

<style scoped>
.category__body{
  display: flex;
  align-items: center;
}
.body__product-description{
  padding: 0 30px;
  max-width: 60%;
  width: 100%;
}
.body__product-image{

}
.text-uppercase{
  text-transform: uppercase;
}
.table{
  border-bottom: 1px solid rgb(185, 185, 185);
  padding: 5px 10px;
}
.width-50{
  max-width: 50%;
  width: 100%;
}
.width-60{
  max-width: 60%;
}
@media(max-width: 960px) {
  .category__body{
  display: flex;
  align-items: stretch;
  flex-flow: column nowrap;
}
  .body__product-description{
  padding: 0 30px;
  max-width: 100%;
}

.body__product-image{
  order: 1;
}
.body__product-description{
  order: 2;
}
}
</style>
