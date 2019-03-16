<template>
  <v-app class="primary">
    <v-content>
      <v-container
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm6
          >
            <v-card
              class="rounded-card elevation-5"
            >
              <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="submit"
              >
                <v-card-title>
                  <div>
                    <span class="headline text-uppercase">Sign In</span>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    ref="email"
                    v-model="form.email"
                    :error-messages="errors.email"
                    label="E-mail"
                    validate-on-blur
                    type="text"
                    :rules="[rules.required, rules.validEmail]"
                  />
                  <v-text-field
                    v-model="form.password"
                    label="Password"
                    validate-on-blur
                    type="password"
                    :rules="[rules.required]"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    round
                    flat
                    color="primary"
                    type="submit"
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
          }).catch((err) => {
            console.log(err)
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
