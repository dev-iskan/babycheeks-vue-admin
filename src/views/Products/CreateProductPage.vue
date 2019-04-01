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
        name: '',
        description: '',
        gender: '',
        brand_id: 0,
        categories: null,
        ages: null
      },
      genders: [
        { value: 'm', text: 'Male' },
        { value: 'f', text: 'Female' },
        { value: 'u', text: 'Unisex' }
      ],
      dropzone: {
        options: {
          url: 'test',
          autoProcessQueue: false,
          acceptedFiles: 'image/*',
          addRemoveLinks: true,
          maxFiles: 5
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
  created () {
    this.fetchData('categories')
    this.fetchData('brands')
    this.fetchData('ages')
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        crud.store('admin/products', this.createFormData())
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
      formData.append('gender', this.form.gender)
      formData.append('brand_id', this.form.brand_id)

      this.form.categories.forEach(el => {
        formData.append('categories[]', el)
      })
      this.form.ages.forEach(el => {
        formData.append('ages[]', el)
      })
      this.$refs.dropzone.getAcceptedFiles().forEach((file, index) => {
        formData.append('images[]', file)
      })
      return formData
    },

    async fetchData (endpoint) {
      const requestConfig = {
        method: 'get',
        url: `admin/${endpoint}`,
        params: {
          pluck: true
        }
      }
      const response = await api.customRequest(requestConfig)

      this[endpoint] = Object.keys(response.data).map(key => {
        return {
          value: key,
          text: response.data[key]
        }
      })
    },

    removeChip (item, data) {
      const index = this.form[data].indexOf(item.value)
      this.form[data].splice(index, 1)
    },

    clearForm () {
      this.form.name = ''
      this.form.description = ''
      this.form.gender = ''
      this.form.brand_id = null
      this.form.categories = null
      this.form.ages = null
      this.$refs.dropzone.removeAllFiles()
    }
  }
}
</script>

<style scoped>

</style>
