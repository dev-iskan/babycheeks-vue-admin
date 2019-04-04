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
          :init="tinymce"
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
          @vdropzone-sending="sending"
          @vdropzone-removed-file="removing"
          @vdropzone-success="success"
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
import { dropzone, tinymce } from '@/utils/common'
export default {
  components: {
    CardTitle
  },
  data () {
    return {
      sucess: false,
      form: {
        id: '',
        slug: '',
        name: '',
        description: '',
        parent_id: 0,
        image_id: null
      },
      dropzone: dropzone(1),
      tinymce,
      categories: [],
      valid: false,
      buttonLoading: false,
      rules: {
        required: v => !!v || 'Field is required'
      }
    }
  },
  async created () {
    const category = await crud.create('admin/categories')
    this.form.id = category.id
    this.form.slug = category.slug

    this.categories = await crud.pluckData('admin/categories', {
      parent: true
    })
  },
  methods: {
    sending (file, xhr, formData) {
      formData.append('model', 'category')
      formData.append('slug', this.form.slug)
    },
    removing (file, xhr, formData) {
      if (this.sucess) {
        return
      }
      if (file.id) {
        api.delete(`admin/media/destroy/${file.id}`)
          .catch(() => {
            this.$refs.dropzone.manuallyAddFile(file, file.dataURL)
          })
      }
    },
    success (file, response) {
      file.id = response.id
      this.form.image_id = response.id
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        crud.store('admin/categories', {
          name: this.form.name,
          description: this.form.description,
          parent_id: this.form.parent_id,
          image: this.form.image_id
        }, this.form.slug)
          .then(() => {
            this.$router.push({ name: 'categories.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.sucess = true
    next()
  }
}
</script>

<style scoped>

</style>
