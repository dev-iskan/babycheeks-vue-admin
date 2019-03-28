<template>
  <v-app>
    <v-content class="background">
      <v-container
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm4
          >
            <v-card
              class="rounded-card elevation-5"
            >
              <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="submit"
              >
                <v-card-title class="justify-center pt-4">
                  <span class="headline text-uppercase">Sign In</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    ref="email"
                    v-model="form.email"
                    :error-messages="errors.email"
                    label="E-mail"
                    prepend-icon="account_circle"
                    validate-on-blur
                    type="text"
                    :rules="[rules.required, rules.validEmail]"
                  />
                  <v-text-field
                    v-model="form.password"
                    label="Password"
                    validate-on-blur
                    prepend-icon="vpn_key"
                    type="password"
                    :rules="[rules.required]"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    outline
                    color="primary"
                    type="submit"
                    :disabled="buttonLoading"
                    :loading="buttonLoading"
                  >
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      buttonLoading: false,
      valid: false,
      rules: {
        required: v => !!v || 'Field is required',
        validEmail: v => /.+@.+\..+/.test(v) || 'Email is invalid'
      }
    }
  },
  methods: {
    ...mapActions('auth', [
      'login'
    ]),

    submit () {
      if (this.$refs.form.validate()) {
        this.buttonLoading = true
        this.login({
          email: this.form.email,
          password: this.form.password
        })
          .then((result) => {
            this.successRedirect()
          })
          .finally(() => { this.buttonLoading = false })
      }
    },

    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'home' }
      this.$router.push(redirectTo)
    }
  }
}
</script>

<style scoped>

</style>
