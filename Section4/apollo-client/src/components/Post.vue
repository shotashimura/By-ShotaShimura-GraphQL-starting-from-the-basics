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
        <v-list-item-subtitle>From Apollo-Server</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!-- 編集・削除ボタン -->
    <v-card-actions>
        <v-btn
              color='success'
              small
              @click='showDialogUpdate(post.id,post.title,post.author)'
          >
            <v-icon small>
              編集する
            </v-icon>
          </v-btn>
          <v-btn
              color='error'
              small
              @click='deletePost(post.id,post.title)'
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
import {CREATE_POST,UPDATE_POST,DELETE_POST} from '../graphql/mutation';
//Subscription
import {SUBSCRIPTION_POST} from '../graphql/subscription';

export default {
   name: 'Post',
    data: () => ({
      //本棚の中身を定義
      posts: [],
       // フォーム入力値
      post: {
        id: '',
        title: '',
        author: '',
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
      //サブスクリプション
       subscribeToMore: {
        document: SUBSCRIPTION_POST,
        updateQuery:(previousResult, { subscriptionData }) =>{
             console.log(previousResult) //変更以前の全ての投稿
             console.log(subscriptionData) //変更のあった投稿
        //idによる比較
        if (previousResult.posts.find(post => post.id === subscriptionData.data.post.data.id)) {
          return previousResult
        }else{
           return {
          posts: [
            ...previousResult.posts,
            // データの追加と更新
            subscriptionData.data.post.data,
          ],
        }
        }
            }
            }
        }
  },
 methods: {
    // --------------------------------
      // 新規作成
      // --------------------------------
      createPost: function () {
        if (this.$refs.form.validate()) {
          this.progress = true
          this.$apollo.mutate({
           mutation: CREATE_POST,
            variables: {
              title: this.post.title,
              author: this.post.author,
            },
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
        }
      }
      ,
      // --------------------------------
      // 更新
      // --------------------------------
      updatePost: function () {
        if (this.$refs.form.validate()) {
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
       }
      },
      // --------------------------------
      // 削除
      // --------------------------------
      deletePost: function (id,title) {
        console.log(id)
        console.log(title)
        if (!confirm(title + 'を削除してもよろしいですか？')) {
          return
        }
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
      showDialogUpdate: function (id, title, author) {
        this.post.id = id
        this.post.title = title
        this.post.author = author
        this.isCreate = false
        this.dialog = true
      },
    }
  }
</script>

<style>
#block{
   text-align:center;
   display: inline-block;
}
</style>
