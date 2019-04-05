<template>
  <v-card class="rounded-card elevation-2">
    <v-form
      ref="form"
      v-model="valid"
      @submit.prevent="submit"
    >
      <card-title
        v-if="routeKey"
        :title="'Edit product # '+ routeKey"
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
          :rules="[rules.required, rules.array]"
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
          :rules="[rules.required, rules.array]"
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
          :options="dropzone"
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
import { dropzone, tinymce } from '@/utils/common'
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
      dropzone: dropzone(5),
      tinymce,
      categories: [],
      ages: [],
      brands: [],
      valid: false,
      buttonLoading: false,
      rules: {
        required: v => !!v || 'Field is required',
        array: v => !!v.length || 'Field is empty'
      }
    }
  },
  async created () {
    this.categories = await crud.pluckData('admin/categories', {
      pluck: true
    })
    this.brands = await crud.pluckData('admin/brands', {
      pluck: true
    })
    this.ages = await crud.pluckData('admin/ages', {
      pluck: true
    })
    const product = await crud.fetchSingle('admin/products', this.routeKey)
    try {
      this.form.name = product.name
      this.form.description = product.description
      this.form.brand_id = String(product.brand)
      this.form.gender = product.gender
      this.form.categories = Object.keys(product.categories)
      this.form.ages = Object.keys(product.ages)
    } catch (err) {
      if (err.response.status === 404) { this.$router.push({ name: 'products.index' }) }
    }
  },
  methods: {
    sending (file, xhr, formData) {
      formData.append('model', 'product')
      formData.append('slug', this.routeKey)
    },
    mounted () {
      crud.fetchMedia('product', this.routeKey)
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
        crud.update(`admin/products/${this.routeKey}`, {
          name: this.form.name,
          description: this.form.description,
          gender: this.form.gender,
          brand_id: this.form.brand_id,
          categories: this.form.categories,
          ages: this.form.ages,
          images: this.form.images
        })
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
