<template>
  <div>
     <router-link to='/'>トップページ</router-link>
     <v-form ref='form' v-model='valid' lazy-validation>
            <v-text-field
                type='email'
                v-model='email'
                :rules='emailRules'
                label='メールアドレス'
                required
            ></v-text-field>
            <v-text-field
                type='password'
                v-model='password'
                :rules='passwordRules'
                label='パスワード'
                required
            ></v-text-field>
            <!--ログインボタン-->
            <v-btn
                :disabled='!valid'
                @click='login'
            >
              ログイン
            </v-btn>
          </v-form>
  </div>
</template>

<script>
import {onLogin} from '../vue-apollo.js'
//Mutation
import {LOGIN} from '../graphql/mutation'
//Vuex
import { mapActions } from 'vuex'
export default {
  data: () => ({
      email: '',
      password: '',
       // バリデーション
      valid: true,
      emailRules: [
        (value) => !!value || '* メールアドレスを入力してください',
        (value) => (value || '').length <= 51 || '* 50字以下で入力してください',
        (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) || '* メールアドレスの入力形式に誤りがあります'
          );
        },
      ],
      passwordRules: [
       (value) => !!value || '*パスワードを入力してください',
       (value) => (value || '').length >= 8 || '* 8字以上で入力してください',
      ],
  }),
  methods: {
     ...mapActions({
      loginVuex: 'loginVuex'
    }),
    login: function () {
        if (this.$refs.form.validate()) {
          this.$apollo.mutate({
           mutation: LOGIN,
            variables: {
              email: this.email,
              password: this.password
            },
          })
          .then((data) => {
            console.log(data)
            //Vue Apolloデフォルトのログイン
            onLogin(this.$apollo.provider.defaultClient, data.data.login.token)
            //ローカルストレージにキーとバリューをセット
            localStorage.setItem('userInfo', JSON.stringify(data));
            //vueXへ値を渡す
            this.loginVuex(data);
            //トップページへ移動
            this.$router.push('/')
          }).catch((error) => {
            console.error(error)
          })
        }
      }
  },
}
</script>

<style>
</style>