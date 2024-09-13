<script setup>
const { t } = useI18n();
import { loginApi } from '@/api/login';
import { setToken } from '@/utils/auth';
const loginModalStore = useLoginModalStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const formValue = reactive({
  email: '',
  password: '',
});
const loginLoading = ref(false);
const handleSubmit = async (formData) => {
  if (formData.errors) return;
  const { email, password } = formData.values;
  loginLoading.value = true;
  const userData = await loginApi({ email, password }).finally(() => {
    loginLoading.value = false;
  });
  userStore.login(userData);

  if (userData?.token) {
    setToken(userData.token, userData.expire);
  }
  if (route.query.login === 'true') {
    await router.replace({ query: { ...route.query, login: undefined } });
  }
  loginModalStore.closeLoginModal();
  router.go(0);
};

const goRegister = () => {
  loginModalStore.closeLoginModal();
  router.push('/register');
};

const model = defineModel();
function toggleType() {
  model.value = 'forget';
}
</script>

<template>
  <div class="title">
    {{ t('login.loginByAccount') }}
  </div>
  <a-form :model="formValue" @submit="handleSubmit" layout="vertical">
    <a-form-item
      field="email"
      :label="t('login.email')"
      :rules="[
        {
          required: true,
          message: `${t('login.email')}${t('login.isRequired')}`,
        },
      ]"
    >
      <a-input v-model="formValue.email" :placeholder="`${t('common.pleaseInput')}${t('login.email')}`" />
    </a-form-item>
    <a-form-item
      field="password"
      :label="t('login.password')"
      :rules="[
        {
          required: true,
          message: `${t('login.password')}${t('login.isRequired')}`,
        },
      ]"
    >
      <a-input-password v-model="formValue.password" :placeholder="t('login.password')" allow-clear />
    </a-form-item>
    <div>
      <a-link @click="toggleType">{{ t('login.forgetPassword') }}</a-link>
    </div>
    <a-button html-type="submit" long type="primary" :loading="loginLoading">{{ t('login.login') }}</a-button>
  </a-form>
  <div class="noAccount">
    {{ t('login.noAccount') }}
    <a-link @click="goRegister">
      {{ t('login.clickToRegister') }}
    </a-link>
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  margin-top: 20px;
  font-weight: bold;
}
</style>
