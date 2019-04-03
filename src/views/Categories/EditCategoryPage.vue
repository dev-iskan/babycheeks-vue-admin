<template>
  <v-card class="rounded-card elevation-2">
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="submit"
    >
      <card-title
        v-if="routeKey"
        :title="'Edit category # '+ routeKey"
      />
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
          @vdropzone-sending="sending"
          @vdropzone-removed-file="removing"
          @vdropzone-success="success"
          @vdropzone-mounted="mounted"
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
          Update
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import CardTitle from '@/components/CardTitle'
import crud from '@/services/crud.service'
import api from '@/services/api.service'
import { TokenService } from '@/services/storage.service'

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
        parent_id: 0,
        image_id: null
      },
      dropzone: {
        options: {
          url: `${process.env.VUE_APP_ROOT_API}admin/media/store`,
          paramName: 'image',
          acceptedFiles: 'image/*',
          addRemoveLinks: true,
          maxFiles: 1,
          headers: {
            'Authorization': `Bearer ${TokenService.getToken()}`
          }
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
    this.fetchParentCategories()
    crud.fetchSingle('admin/categories', this.routeKey)
      .then(category => {
        this.form.name = category.name
        this.form.description = category.description
        this.form.parent_id = String(category.parent)
      })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'categories.index' }) }
      })
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
          })
        })
    },
    removing (file, xhr, formData) {
      if (this.sucess) {
        return
      }
      api.delete(`admin/media/destroy/${file.id}`)
        .catch(() => {
          if (file.id) {
            this.addFileToDropzone(file)
          }
        })
    },
    success (file, response) {
      file.id = response.id
      this.form.image_id = response.id
    },
    addFileToDropzone (file) {
      const drop = this.$refs.dropzone.dropzone
      drop.emit('addedfile', file)
      drop.files.push(file);
      ((file) => {
        drop.createThumbnailFromUrl(
          file,
          200,
          200,
          drop.options.thumbnailMethod,
          true,
          thumbnail => {
            drop.emit('thumbnail', file, thumbnail)
          },
          'Anonymous'
        )
      })(file)
      drop.emit('complete', file)
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        crud.update(`admin/categories/${this.routeKey}`, {
          name: this.form.name,
          description: this.form.description,
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
