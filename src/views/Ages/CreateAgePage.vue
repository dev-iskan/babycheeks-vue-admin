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
        <card-title title="Создание нового возраста" />
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
            Создать
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
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        crud.store('admin/ages', {
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
