import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js';
const VuePlayer = VuePlyr;

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuePlyr, { plyr: {} });
});
