<template>
  <v-flex
    xs12
    d-flex
  >
    <v-card class="rounded-card elevation-2">
      <v-form
        ref="form"
        v-model="valid"
        @submit.prevent="submit"
      >
        <card-title
          v-if="routeKey"
          :title="'Изменение возраста # '+ routeKey"
        />
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="form.age"
            label="Возраст"
            validate-on-blur
            :error-messages="errors.age"
            type="text"
            :rules="[rules.required]"
          />
        </v-card-text>
        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn
            outline
            type="submit"
            :loading="buttonLoading"
            color="primary"
          >
            Изменить
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-flex>
</template>

<script>
import CardTitle from '@/components/CardTitle'
import crud from '@/services/crud.service'
export default {
  components: {
    CardTitle
  },
  props: {
    routeKey: {
      required: true,
      type: [Number, String]
    }
  },
  data () {
    return {
      form: {
        age: ''
      },
      valid: false,
      buttonLoading: false,
      rules: {
        required: v => !!v || 'Field is required'
      }
    }
  },
  created () {
    this.setPageLoading()
    crud.fetchSingle('admin/ages', this.routeKey)
      .then(age => { this.form.age = age.age })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'ages.index' }) }
      })
      .finally(() => { this.setPageReady() })
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        crud.update(`admin/ages/${this.routeKey}`, {
          age: this.form.age
        })
          .then(() => {
            this.$router.push({ name: 'ages.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    }
  }
}
</script>

<style scoped>

</style>
