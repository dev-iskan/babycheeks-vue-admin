<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.keys(age).length > 0">
        <div
          v-for="key in Object.keys(age)"
          :key="key"
          align-center
          justify-space-between
          row
          fill-height
          class="subheading table d-flex"
        >
          <div class="d-flex width-50">
            {{ key }}
          </div>
          <div class="d-flex width-50">
            {{ age[key] }}
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
.table{
  text-transform: uppercase;
  border-bottom: 1px solid rgb(185, 185, 185);
  padding: 5px 10px;
}
.width-50{
  width: 50%;
}
</style>
