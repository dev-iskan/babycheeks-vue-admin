<template>
  <v-card class="rounded-card elevation-2">
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="submit"
    >
      <card-title title="Create new age" />
      <v-divider />
      <v-card-text>
        <v-text-field
          v-model="form.age"
          label="Age"
          validate-on-blur
          :error-messages="errors.age"
          type="text"
          :rules="[rules.required]"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outline
          type="submit"
          :loading="buttonLoading"
          :disabled="buttonLoading"
          color="primary"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import CardTitle from '@/components/CardTitle'
import post from '@/services/post.service'
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
        post.store('admin/ages', this.createFormData())
          .then(() => {
            this.clearForm()
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    createFormData () {
      const formData = new FormData()
      formData.append('age', this.form.age)
      return formData
    },
    clearForm () {
      this.form = {}
    }
  }
}
</script>

<style scoped>

</style>
