<template>
<div>
    <div v-if='isLogin'>
      <p>こんにちは！{{loginUser.name}}さん！</p><br>
      <p @click="logout">ログアウト</p>
    </div>
    <div v-else>
      <router-link to='/createUser'>新規登録</router-link><br>
      <router-link to='/login'>ログイン</router-link>
    </div>
    <!-- ログインユーザーの情報を子コンポーネントへ受け渡し -->
    <Post :loginUser='loginUser'/>
</div>
</template>

<script>
import {onLogout} from '../vue-apollo.js'
//Vuex
import { mapState,mapActions} from 'vuex'
//components
import Post from '../components/Post';

export default {
  data: () => ({
      loginUser: [],
      isLogin: false,
      token:''
  }),
  computed: mapState([
  'user'
]),
 methods: {
   ...mapActions({
      logoutVuex : 'logoutVuex'
    }),
    logout: function () {
      onLogout(this.$apollo.provider.defaultClient)
      this.logoutVuex()
      this.$router.push('/login')
      }
  },
  created() {
    this.token = JSON.parse(localStorage.getItem('userInfo')) 
    const key = Object.keys(this.user.user)
    this.loginUser = this.user.user[key[0]];
    console.log(key)
     if (this.loginUser) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
        this.loginUser = null;
      }
     // VueXのstateにあるログインユーザー情報のオブジェクト
     console.log(this.loginUser)
  },
  components: {
    Post,
  },
}
</script>