<template>
  <v-card class="rounded-card elevation-2">
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="submit"
    >
      <card-title title="Create new category" />
      <v-divider />
      <v-card-text>
        <v-text-field
          v-model="form.name"
          label="Name"
          validate-on-blur
          :error-messages="errors.name"
          type="text"
          :rules="[rules.required]"
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          auto-grow
        />
        <v-autocomplete
          v-model="form.parent_id"
          :items="categories"
          item-text="text"
          validate-on-blur
          clearable
          :rules="[rules.required]"
          :error-messages="errors.parent_id"
          item-value="value"
          label="Parent Category"
        />
        <vue-dropzone
          id="dropzone"
          ref="dropzone"
          class="my-2"
          :options="dropzone.options"
        />
      </v-card-text>

      <v-card-actions class="pa-3">
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
import api from '@/services/api.service'

export default {
  components: {
    CardTitle
  },
  data () {
    return {
      form: {
        name: '',
        description: '',
        parent_id: null
      },
      dropzone: {
        options: {
          url: 'test',
          autoProcessQueue: false,
          acceptedFiles: 'image/*',
          addRemoveLinks: true,
          maxFiles: 1,
          useCustomSlot: true
        }
      },
      categories: [],
      valid: false,
      buttonLoading: false,
      rules: {
        required: v => !!v || 'Field is required'
      }
    }
  },
  created () {
    this.fetchParentCategories()
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        post.store('admin/categories', this.createFormData())
          .then(() => {
            this.clearForm()
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    createFormData () {
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('description', this.form.description)
      formData.append('parent_id', this.form.parent_id)
      formData.append('image', this.$refs.dropzone.getAcceptedFiles()[0])
      return formData
    },

    async fetchParentCategories () {
      const requestConfig = {
        method: 'get',
        url: 'admin/categories',
        params: {
          parent: true
        }
      }
      const response = await api.customRequest(requestConfig)

      this.categories = Object.entries(response.data).map((entry) => {
        return {
          value: entry[0],
          text: entry[1]
        }
      })
    },

    clearForm () {
      this.form = {}
      this.$refs.dropzone.removeAllFiles()
    }
  }
}
</script>

<style scoped>

</style>
