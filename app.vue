<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <LoginModal></LoginModal>
    <ChangePasswordModal></ChangePasswordModal>
    <NuxtPage :keepalive="{ include: 'home,acct,public-local,public-common,notification,wallet,subscribed' }" />
    <Loading />
  </NuxtLayout>
</template>
<script setup>
import './assets/main.scss';

import 'tippy.js/dist/tippy.css'; // tippy
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/scale.css';
import Loading from '@/components/loading/index.vue';

onMounted(async () => {
  await nextTick();

  const script = document.createElement('script');
  script.src = '/lib/rive/rive@2.16.0.js';
  document.body.appendChild(script);
  // 开发环境添加vconsole
  if (process.env.NODE_ENV === 'development') {
    const script = document.createElement('script');
    script.src = '//unpkg.com/vconsole@latest/dist/vconsole.min.js';
    document.head.appendChild(script);
  }

  window.dispatchEvent(new Event('nuxt:loading-finish'));
});
</script>
