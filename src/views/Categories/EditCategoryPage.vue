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
          :title="'Изменение категории # '+ routeKey"
        />
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
            class="my-2"
            :use-custom-slot="true"
            :options="dropzone"
            @vdropzone-sending="sending"
            @vdropzone-removed-file="removing"
            @vdropzone-success="success"
            @vdropzone-mounted="mounted"
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
import api from '@/services/api.service'
import { dropzone, tinymce } from '@/utils/common'
import { apiKey, rules } from '@/utils/form'

export default {
  components: {
    CardTitle
  },
  props: {
    routeKey: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      sucess: false,
      form: {
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
      this.categories = await crud.pluckData('admin/categories', {
        parent: true
      })
      const category = await crud.fetchSingle('admin/categories', this.routeKey)
      this.form.name = category.name
      this.form.description = category.description
      this.form.primary = category.primary
      this.form.parent_id = String(category.parent)
      this.setPageReady()
    } catch (e) {
      this.setPageReady()
      if (e.response.status === 404) { this.$router.push({ name: 'categories.index' }) }
    }
  },
  methods: {
    sending (file, xhr, formData) {
      formData.append('model', 'category')
      formData.append('slug', this.routeKey)
    },
    mounted () {
      crud.fetchMedia('category', this.routeKey)
        .then(media => {
          media.forEach(item => {
            const file = {
              id: item.id,
              name: item.name,
              size: item.size,
              dataURL: item.dataURL
            }
            this.$refs.dropzone.manuallyAddFile(file, file.dataURL)
            this.form.image_id = item.id
          })
        })
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
        crud.update(`admin/categories/${this.routeKey}`, {
          name: this.form.name,
          description: this.form.description,
          primary: this.form.primary,
          parent_id: this.form.parent_id,
          image: this.form.image_id
        })
          .then(() => {
            this.$router.push({ name: 'categories.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },

    async fetchParentCategories () {
      const requestConfig = {
        method: 'get',
        url: 'admin/categories',
        params: {
          parent: true,
          category_slug: this.routeKey
        }
      }
      const response = await api.customRequest(requestConfig)

      this.categories = Object.keys(response.data).map(key => {
        return {
          value: key,
          text: response.data[key]
        }
      })
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
