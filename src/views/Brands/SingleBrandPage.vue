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
      brand: {},
      buttonLoading: false
    }
  },
  created () {
    crud.fetchSingle('admin/brands', this.routeKey)
      .then(brand => { this.brand = brand })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'brands-list' }) }
      })
  },
  methods: {
    destroy () {
      if (confirm('Are you sure?')) {
        crud.destroy(`admin/brands/${this.routeKey}`)
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
