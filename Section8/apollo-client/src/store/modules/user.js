import Vue from 'vue'

const getDefaultState = () => {
    return {
      user: [],
      status: 'Not Login'
    }
  }

const state = getDefaultState()

console.log(state.user);
const mutations = {
    setUser(state, data) {
        Vue.set(state.user, data.id, data);
    },
    resetState (state) {
        Object.assign(state, getDefaultState())
      }
};
const actions = {
  async loginVuex ({commit}, value) {
   let data = {
    id: value.data.login.user.id,
    name: value.data.login.user.name
  };
   commit('setUser', data);
  },
 async logoutVuex ({commit}) {
   localStorage.removeItem('userInfo')
   commit('resetState')
 },
   async currentUser ({commit}) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) 
    if(userInfo){
    let data = {
        id: userInfo.data.login.user.id,
        name: userInfo.data.login.user.name
      };
   commit('setUser', data);
    }
 }
};
const getters = {
}
export default {
  state,
  mutations,
  actions,
  getters
}
