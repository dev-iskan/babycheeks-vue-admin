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
        <card-title title="Создание нового продукта" />
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
          <v-text-field
            v-model="form.price"
            label="Цена"
            validate-on-blur
            :error-messages="errors.price"
            type="number"
            :rules="[rules.required]"
          />
          <v-autocomplete
            v-model="form.brand_id"
            :items="brands"
            item-text="text"
            item-value="value"
            label="Бренд"
            clearable
          />
          <v-autocomplete
            v-model="form.categories"
            :items="categories"
            item-text="text"
            multiple
            validate-on-blur
            clearable
            :rules="[rules.required, rules.array]"
            :error-messages="errors.categories"
            item-value="value"
            label="Категории"
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
            :rules="[rules.required, rules.array]"
            :error-messages="errors.ages"
            item-value="value"
            label="Возрасты"
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
import { genders, apiKey, rules } from '@/utils/form'
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
        price: '',
        gender: '',
        brand_id: 0,
        categories: null,
        ages: null,
        images: []
      },
      genders,
      apiKey,
      dropzone: dropzone(5),
      tinymce,
      categories: [],
      ages: [],
      brands: [],
      valid: false,
      buttonLoading: false,
      rules
    }
  },
  async created () {
    try {
      this.setPageLoading()
      const product = await crud.create('admin/products')
      this.form.id = product.id
      this.form.slug = product.slug
      this.form.gender = product.gender

      this.categories = await crud.pluckData('admin/categories', {
        pluck: true
      })
      this.brands = await crud.pluckData('admin/brands', {
        pluck: true
      })
      this.ages = await crud.pluckData('admin/ages', {
        pluck: true
      })
      this.setPageReady()
    } catch (e) {
      this.setPageReady()
      throw e
    }
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
      if (file.id) {
        api.delete(`admin/media/destroy/${file.id}`)
          .catch(() => {
            this.$refs.dropzone.manuallyAddFile(file, file.dataURL)
          })
      }
    },
    success (file, response) {
      file.id = response.id
      this.form.images.push(response.id)
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
          price: this.form.price,
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
