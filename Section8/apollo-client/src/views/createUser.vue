<template>
  <div>
     <v-form ref='form' v-model='valid' lazy-validation>
            <v-text-field
                type='name'
                v-model='name'
                :rules='nameRules'
                label='お名前'
                required
            ></v-text-field>
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
                @click='createUser'
            >
              新規登録
            </v-btn>
          </v-form>
  </div>
</template>

<script>
//Mutation
import {CREATE_USER} from '../graphql/mutation';
export default {
  data: () => ({
      name: '',
      email: '',
      password: '',
       // バリデーション
      valid: true,
      nameRules: [
       (value) => !!value || '*名前を入力してください',
      ],
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
    createUser: function () {
        if (this.$refs.form.validate()) {
          this.$apollo.mutate({
           mutation: CREATE_USER,
            variables: {
              name: this.name,
              email: this.email,
              password: this.password
            },
          })
          .then((data) => {
            console.log(data)
            this.$router.push('/login')
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