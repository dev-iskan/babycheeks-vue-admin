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
        <editor
          v-model="form.description"
          api-key="lw4jzx0h6ifi7igb38t24u62eiupzkrpttd4f9dhkizquji4"
          :init="options"
          class="my-2"
        />

        <v-autocomplete
          v-model="form.parent_id"
          :items="categories"
          item-text="text"
          clearable
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
import crud from '@/services/crud.service'
import api from '@/services/api.service'

export default {
  components: {
    CardTitle
  },
  data () {
    return {
      form: {
        id: '',
        slug: '',
        name: '',
        description: '',
        parent_id: 0
      },
      dropzone: {
        options: {
          url: 'test',
          autoProcessQueue: false,
          acceptedFiles: 'image/*',
          addRemoveLinks: true,
          maxFiles: 1
        }
      },
      options: {
        plugins: 'lists, table fullscreen',
        toolbar: `undo redo fullscreen | styleselect |
                  bold italic |
                  alignleft aligncenter alignright alignjustify |
                  bullist numlist outdent indent`
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
    crud.create('admin/categories')
      .then(category => {
        this.form.id = category.id
        this.form.slug = category.slug
      })
    this.fetchParentCategories()
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        crud.store('admin/categories', this.createFormData(), this.form.slug)
          .then(() => {
            this.clearForm()
            this.$router.push({ name: 'categories.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    createFormData () {
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('description', this.form.description)
      formData.append('parent_id', this.form.parent_id)
      if (this.$refs.dropzone.getAcceptedFiles()[0]) formData.append('image', this.$refs.dropzone.getAcceptedFiles()[0])
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

      this.categories = Object.keys(response.data).map(key => {
        return {
          value: key,
          text: response.data[key]
        }
      })
    },

    clearForm () {
      this.form.name = ''
      this.form.description = ''
      this.form.parent_id = null
      this.$refs.dropzone.removeAllFiles()
    }
  }
}
</script>

<style scoped>

</style>
