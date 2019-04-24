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
        <card-title title="Создание новой категории" />
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Название"
            validate-on-blur
            :error-messages="errors.name"
            type="text"
            :rules="[rules.required]"
          />
          <editor
            v-model="form.description"
            :api-key="apiKey"
            :init="tinymce"
            class="my-2"
          />
          <v-switch
            v-model="form.primary"
            label="Сделать категорию главной"
          />
          <v-autocomplete
            v-model="form.parent_id"
            :items="categories"
            item-text="text"
            clearable
            item-value="value"
            label="Родительская категория"
          />
          <vue-dropzone
            id="dropzone"
            ref="dropzone"
            :use-custom-slot="true"
            class="my-2"
            :options="dropzone"
            @vdropzone-sending="sending"
            @vdropzone-removed-file="removing"
            @vdropzone-success="success"
          >
            <div
              v-if="errors.images"
              class="dropzone-custom-content"
            >
              <h3 class="dropzone-custom-title">
                {{ errors.images[0] }}
              </h3>
            </div>
          </vue-dropzone>
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
import api from '@/services/api.service'
import { dropzone, tinymce } from '@/utils/common'
import { apiKey, rules } from '@/utils/form'
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
        primary: false,
        parent_id: 0,
        image_id: null
      },
      dropzone: dropzone(1),
      tinymce,
      categories: [],
      valid: false,
      buttonLoading: false,
      rules,
      apiKey
    }
  },
  async created () {
    try {
      this.setPageLoading()
      const category = await crud.create('admin/categories')
      this.form.id = category.id
      this.form.slug = category.slug

      this.categories = await crud.pluckData('admin/categories', {
        parent: true
      })
      this.setPageReady()
    } catch (e) {
      this.setPageReady()
      throw e
    }
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
          primary: this.form.primary,
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
