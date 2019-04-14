<template>
  <v-flex
    xs12
    d-flex
  >
    <v-card class="rounded-card elevation-2">
      <v-card-text>
        <template v-if="Object.keys(brand).length > 0">
          <div
            v-for="key in Object.keys(brand)"
            :key="key"
            align-center
            justify-space-between
            row
            fill-height
            class=" d-flex subheading table"
          >
            <div class="d-flex width-50 text-uppercase">
              {{ key }}
            </div>
            <div class="d-flex width-50">
              {{ brand[key] }}
            </div>
          </div>
        </template>
      </v-card-text>
      <v-card-actions class="pa-3">
        <v-spacer />
        <v-btn
          outline
          color="blue"
          @click.prevent="edit"
        >
          Изменить
        </v-btn>
        <v-btn
          outline
          :loading="buttonLoading"
          color="red"
          @click.prevent="destroy"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
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
    this.setPageLoading()
    crud.fetchSingle('admin/brands', this.routeKey)
      .then(brand => { this.brand = brand })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'brands.index' }) }
      })
      .finally(() => { this.setPageReady() })
  },
  methods: {
    destroy () {
      if (confirm('Вы уверены?')) {
        crud.destroy(`admin/brands/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'brands.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    edit () {
      this.$router.push({ name: 'brands.edit', params: { routeKey: this.routeKey } })
    }
  }
}
</script>

<style scoped>
</style>
