<template>
  <v-card class="rounded-card elevation-2">
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="submit"
    >
      <card-title title="Create new product" />
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
        />
        <v-radio-group
          v-model="form.gender"
          validate-on-blur
          :rules="[rules.required]"
          :error-messages="errors.gender"
        >
          <v-radio
            v-for="gender in genders"
            :key="gender.value"
            color="primary"
            :label="gender.text"
            :value="gender.value"
          />
        </v-radio-group>
        <v-autocomplete
          v-model="form.brand_id"
          :items="brands"
          item-text="text"
          item-value="value"
          label="Brand"
          clearable
        />
        <v-autocomplete
          v-model="form.categories"
          :items="categories"
          item-text="text"
          multiple
          validate-on-blur
          clearable
          :rules="[rules.required]"
          :error-messages="errors.categories"
          item-value="value"
          label="Categories"
        >
          <template v-slot:selection="data">
            <v-chip
              :selected="data.selected"
              close
              outline
              color="primary"
              class="chip--select-multi"
              @input="removeChip(data.item, 'categories')"
            >
              {{ data.item.text }}
            </v-chip>
          </template>
        </v-autocomplete>
        <v-autocomplete
          v-model="form.ages"
          :items="ages"
          item-text="text"
          multiple
          validate-on-blur
          clearable
          :rules="[rules.required]"
          :error-messages="errors.ages"
          item-value="value"
          label="Ages"
        >
          <template v-slot:selection="data">
            <v-chip
              :selected="data.selected"
              close
              outline
              color="secondary"
              class="chip--select-multi"
              @input="removeChip(data.item, 'ages')"
            >
              {{ data.item.text }}
            </v-chip>
          </template>
        </v-autocomplete>
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
import { TokenService } from '@/services/storage.service'

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
        gender: '',
        brand_id: 0,
        categories: null,
        ages: null,
        images: []
      },
      genders: [
        { value: 'm', text: 'Male' },
        { value: 'f', text: 'Female' },
        { value: 'u', text: 'Unisex' }
      ],
      dropzone: {
        options: {
          url: `${process.env.VUE_APP_ROOT_API}admin/media/store`,
          acceptedFiles: 'image/*',
          paramName: 'image',
          addRemoveLinks: true,
          maxFiles: 5,
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
      ages: [],
      brands: [],
      valid: false,
      buttonLoading: false,
      rules: {
        required: v => !!v || 'Field is required'
      }
    }
  },
  async created () {
    const product = await crud.create('admin/products')
    this.form.id = product.id
    this.form.slug = product.slug

    this.categories = await crud.pluckData('admin/categories', {
      pluck: true
    })
    this.brands = await crud.pluckData('admin/brands', {
      pluck: true
    })
    this.ages = await crud.pluckData('admin/ages', {
      pluck: true
    })
  },
  methods: {
    sending (file, xhr, formData) {
      formData.append('model', 'product')
      formData.append('slug', this.form.slug)
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
      this.form.images.push(response.id)
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
        crud.store('admin/products', {
          name: this.form.name,
          description: this.form.description,
          gender: this.form.gender,
          brand_id: this.form.brand_id,
          categories: this.form.categories,
          ages: this.form.ages,
          images: this.form.images
        }, this.form.slug)
          .then(() => {
            this.$router.push({ name: 'products.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },

    removeChip (item, data) {
      const index = this.form[data].indexOf(item.value)
      this.form[data].splice(index, 1)
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
