<template>
  <v-app>
    <v-main>
      <div id='block'>
   <!--入力フォーム-->
    <v-dialog v-model='dialog' max-width='500px'>
      <v-card>
          <h2 v-if='isCreate'>本棚に追加する</h2>
          <h2 v-if='!isCreate'>本棚を更新する</h2>
          <v-form ref='form' v-model='valid' lazy-validation>
            <!--名前-->
            <v-text-field
                v-model='post.title'
                :rules='titleRules'
                :counter='20'
                label='タイトル'
                required
            ></v-text-field>
            <v-text-field
                v-model='post.author'
                :rules='authorRules'
                :counter='20'
                label='作者'
                required
            ></v-text-field>
            <!--追加ボタン-->
            <v-btn
                v-if='isCreate'
                :disabled='!valid'
                @click='createPost'
            >
              追加
            </v-btn>
            <!--更新ボタン-->
            <v-btn
                v-if='!isCreate'
                :disabled='!valid'
                @click='updatePost'
            >
              更新
            </v-btn>
            <v-btn @click='clear'>クリア</v-btn>
          </v-form>
      </v-card>
    </v-dialog>


          <v-row
   style='width: 550px;'
>
    <!--ツールバー-->
    <v-toolbar  color='grey lighten-1'>
      <v-toolbar-title>本棚</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color='primary' dark class='mb-1' @click='showDialogNew'>新規追加</v-btn>
    </v-toolbar>

    <!--本棚の中身-->
<div
v-for='post in posts' :key='post.id'
>
  <v-card
    class='mx-auto'
    width='550px'
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class='headline mb-1'>
           {{ post.title}}/{{ post.author}}
        </v-list-item-title>
        <v-list-item-title class='headline mb-1'>
          Written By {{ post.postedUser.name}}/ 最終更新{{ new Date(post.updatedAt).getMonth()+1}}月{{ new Date(post.updatedAt).getDate()}}日
        </v-list-item-title>
        <v-list-item-subtitle>From Your Database</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!-- 編集・削除ボタン -->
    <v-card-actions>
       <v-btn
              color='success'
              small
              @click='showDialogUpdate(post.id,post.title,post.author, post.postedUser.id)'
          >
            <v-icon small>
              編集する
            </v-icon>
          </v-btn>
          <v-btn
              color='error'
              small
              @click='deletePost(post.id,post.title,post.postedUser.id)'
          >
            <v-icon small>
              削除する
            </v-icon>
          </v-btn>
    </v-card-actions>
  </v-card>
  </div>
  </v-row>
  </div>
    </v-main>
  </v-app>
</template>

<script>
//Query
import {ALL_POSTS} from '../graphql/query'
//Mutation
import {CREATE_POST,UPDATE_POST,DELETE_POST} from '../graphql/mutation'

export default {
   name: 'Post',
   props: ['loginUser'],
    data: () => ({
      //本棚の中身を定義
      posts: [],
       // フォーム入力値
      post: {
        id: '',
        title: '',
        author: '',
        userId: ''
      },
      // バリデーション
      valid: true,
      titleRules: [
        v => !!v || 'タイトルは必須項目です',
        v => (v && v.length <= 20) || 'タイトルは20文字以内で入力してください'
      ],
      authorRules: [
        v => !!v || '作者名は必須項目です',
      ],
      // ローディングの表示フラグ
      progress: false,
      // ダイアログの表示フラグ
      dialog: false,
      // 新規・更新のフラグ
      isCreate: true,
    }),
  apollo: {
    //本棚の中身
    posts: {
      //クエリを書いている部分
      query: ALL_POSTS,
        }
  },
 methods: {
    // --------------------------------
      // 新規作成
      // --------------------------------
      createPost: function () {
        if (this.$refs.form.validate() && this.loginUser != null) {
          this.progress = true
          this.$apollo.mutate({
           mutation: CREATE_POST,
            variables: {
              title: this.post.title,
              author: this.post.author,
              postedUser:this.loginUser.id
            }
          })
          .then(() => {
            //UIの更新
            this.$apollo.queries.posts.fetchMore({
              updateQuery: (previousResult, {fetchMoreResult}) => {
                // console.log(previousResult)  //変更前
                // console.log(fetchMoreResult) //変更後
                return {
                  posts: fetchMoreResult.posts
                }
              }
            })
            this.dialog = false
            this.progress = false
          }).catch((error) => {
            console.error(error)
          })
        }else{
          alert('ログインユーザーのみ投稿が可能です！')
          this.$router.push('/login')
        }
      }
      ,
      // --------------------------------
      // 更新
      // --------------------------------
      updatePost: function () {
        if (this.$refs.form.validate() && this.loginUser.id === this.post.userId) {
        this.progress = true
        this.$apollo.mutate({
          mutation: UPDATE_POST,
          variables: {
              id: this.post.id,
              title: this.post.title,
              author: this.post.author,
          }
        }).then(() => {
          this.$apollo.queries.posts.fetchMore({
            updateQuery: (previousResult, {fetchMoreResult}) => {
              // console.log(previousResult)  //変更前
              // console.log(fetchMoreResult) //変更後
              return {
                posts: fetchMoreResult.posts
              }
            }
          })
          this.dialog = false
          this.progress = false
        }).catch((error) => {
          console.error(error)
        })
        }else{
          alert('更新出来るのは自分の投稿のみです')
        }
      },
      // --------------------------------
      // 削除
      // --------------------------------
      deletePost: function (id,title,userId) {
        if (!confirm(title + 'を削除してもよろしいですか？')) {
          return
        }
        if (this.loginUser.id === userId) {
        this.progress = true
        this.$apollo.mutate({
          mutation: DELETE_POST,
          variables: {
            id: id
          }
        }).then(() => {
          this.$apollo.queries.posts.fetchMore({
            updateQuery: (previousResult, {fetchMoreResult}) => {
              // console.log(previousResult)  //変更前
              // console.log(fetchMoreResult) //変更後
              return {
               posts: fetchMoreResult.posts
              }
            }
          })
          this.progress = false
        }).catch((error) => {
          console.error(error)
        })
        }else{
            alert('削除出来るのは自分の投稿のみです')
        }
      },
       // --------------------------------
      // フォームのクリア
      // --------------------------------
      clear: function () {
        this.$refs.form.reset()
      },
      // --------------------------------
      // 新規追加ダイアログの表示
      // --------------------------------
      showDialogNew: function () {
        // this.clear()
        this.isCreate = true
        this.dialog = true
      },
      // --------------------------------
      // 更新ダイアログの表示
      // --------------------------------
      showDialogUpdate: function (id, title, author,userId) {
        this.post.id = id
        this.post.title = title
        this.post.author = author
        this.post.userId = userId
        this.isCreate = false
        this.dialog = true
      },
    },
    created() {
      // 確認用：親コンポーネントから渡された値
      // console.log(this.loginUser)
    }
  }
</script>

<style>
#block{
   text-align:center;
   display: inline-block;
}
</style>
