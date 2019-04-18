<template>
  <v-flex
    xs12
    d-flex
  >
    <v-card class="rounded-card elevation-2">
      <v-card-text class="category__body">
        <template
          v-if="Object.keys(category).length"
        >
          <div class="body__product-description">
            <div class="subheading d-flex table">
              <div class="d-flex width-50 text-uppercase">
                id
              </div>
              <div class="d-flex">
                {{ category.id }}
              </div>
            </div>
            <div class="subheading d-flex table">
              <div class="d-flex width-50 text-uppercase">
                имя
              </div> <div class="d-flex">
                {{ category.name }}
              </div>
            </div>
            <div class="subheading d-flex table">
              <div class="d-flex width-50 text-uppercase">
                описание
              </div>

              <div
                class="d-flex width-50 body-2"
                v-html="category.description"
              />
            </div>
            <div class="subheading d-flex table">
              <div class="d-flex width-50 text-uppercase">
                родительская категория
              </div> <div class="d-flex width-50">
                {{ category.parent }}
              </div>
            </div>
            <div class="subheading d-flex table">
              <div class="d-flex width-50 text-uppercase">
                главная
              </div> <div class="d-flex width-50">
                <v-icon
                  v-if="category.primary"
                  color="green"
                >
                  done
                </v-icon>
                <v-icon
                  v-else
                  color="red"
                >
                  clear
                </v-icon>
              </div>
            </div>
            <div class="subheading d-flex table">
              <div class="d-flex width-50 text-uppercase">
                создано
              </div> <div class="d-flex width-50">
                {{ category.created_at }}
              </div>
            </div>
          </div>
        </template>
        <template
          v-if="category.image"
          class="body__product-image"
        >
          <v-img
            :src="category.image"
            :lazy-src="lazyImg"
            height="200"
          />
        </template>
      </v-card-text>
      <v-card-actions class="pa-3">
        <v-spacer />
        <v-btn
          outline
          color="primary"
          @click.prevent="edit"
        >
          Изменить
        </v-btn>
        <v-btn
          outline
          :loading="buttonLoading"
          color="secondary"
          @click.prevent="destroy"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import crud from '@/services/crud.service'
export default {
  props: {
    routeKey: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      category: {},
      buttonLoading: false,
      lazyImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAAHgCAIAAADytinCAAAACXBIWXMAAC4jAAAuIwF4pT92AAARrklEQVR42u3dW2wU5f/AYbBIKYdSPCEazocoAhorkpggF8IfNGI4iQh4BIKpigoiGiUaLyTxcIFRsFEEMUFCiIcLY6IRkVBEQVCRABcoCBQCpbY/aWkB5f+GN25qi7WyW7orz3PRbLfT2emEfPplOjPb7CQAaamZXQAg0AAINIBAAyDQAAINgEADINAAAg2AQAMINAACDYBAAwg0AAININAACDSAQAMg0AAINIBAAyDQAAINgEADINAAAg2AQAMINAACDSDQAAg0AAININAACDSAQAMg0AAINIBAAyDQAAINgEADCDQAAg2AQAMINAACDSDQAAg0AAININAACDSAQAMg0AAINIBAAyDQAAINgEADCDQAAg2AQAMINAACDSDQAAg0AAININAACDSAQAMg0AACDYBAAyDQAAINgEADCDQAAg2AQAMINAACDSDQAAg0gEADINAACDSAQAMg0AACDYBAAyDQAAINgEADCDQAAg2AQAMINAACDSDQAAg0gEADINAACDSAQAMg0AACDYBAAyDQAAINgEADCDQAAg0g0AAINAACDSDQAAg0gEADINAACDSAQAMg0AACDYBAAwg0AAINgEADCDQAAg0g0AAINAACDSDQAAg0gEADINAACDSAQAMg0AACDYBAAwg0AAINgEADCDQAAg0g0AAINAACDSDQAAg0gEADINAAAg2AQAMg0AACDYBAAwg0AAINgEADCDQAAg0g0AAINIBAAyDQAAg0gEADINAAAg2AQAMg0AACDYBAAwg0AAINgEADCDQAAg0g0AAINIBAAyDQAAg0gEADINAAAg2AQAMg0AACDYBAAwg055I//vjj+PHjJ0ipsEv900KgSbbOgf3QSPvWTkCgSaogJSUlTz755LBhw/6PFBkxYsT8+fOrq6tlGoEmKTfddFOzZs0uvPDCjh07XkLSwm7My8sLu7SgoCDs3t9//92/MQSafyeGY+vWrSEljzzyiJSk9v8lQ4cOzcnJ+e233wzRCDT/2okTJ8LHDRs2hEAvWbIkPPZ3rZSIu/GBBx4IO7a0tFSgEWiSCvSiRYvC42PHjv1B0sJuDDtz+vTpYcf++uuvAo1Ak1Sg3377bRN0Y0zQAo1AI9AC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'
    }
  },
  created () {
    this.setPageLoading()
    crud.fetchSingle('admin/categories', this.routeKey)
      .then(category => { this.category = category })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'categories.index' }) }
      })
      .finally(() => { this.setPageReady() })
  },
  methods: {
    destroy () {
      if (confirm('Вы уверены?')) {
        crud.destroy(`admin/categories/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'categories.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    edit () {
      this.$router.push({ name: 'categories.edit', params: { routeKey: this.routeKey } })
    }
  }
}
</script>

<style scoped>

</style>
