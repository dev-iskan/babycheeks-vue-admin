<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.keys(age).length > 0">
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
    crud.fetchSingle('admin/ages', this.routeKey)
      .then(age => { this.age = age })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'ages.index' }) }
      })
  },
  methods: {
    destroy () {
      if (confirm('Are you sure?')) {
        crud.destroy(`admin/ages/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'ages.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    edit () {
      this.$router.push({ name: 'ages.edit', params: { routeKey: this.routeKey } })
    }
  }
}
</script>

<style scoped>

</style>
