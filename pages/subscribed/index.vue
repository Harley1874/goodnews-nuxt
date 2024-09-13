<script setup>
const userlist = useState('subscribeUserList');
import defaultAvatar from '@/assets/images/default-avatar.jpg';
import { getAccountList, getUnlockTweetList, readAll } from '@/api/subscribed';
const { t } = useI18n();
defineOptions({ name: 'subscribed' });

useHead({
  title: t('subscribed.head'),
  meta: [
    {
      name: 'description',
      content: t('subscribed.head'),
    },
  ],
});

const renderImage = (url) => {
  return url ? url : defaultAvatar;
};
const activeUser = ref(null);
const subscribeNum = useState('subscribeNum');
const searchPost = ref({
  input: '',
  isHidden: false,
});
const searchLoading = ref(false);
const searchUser = async () => {
  searchLoading.value = true;
  const parmas = {
    keyword: searchPost.value.input,
    is_hidden: searchPost.value.isHidden ? '1' : '0',
  };
  try {
    const { data: res } = await getAccountList(parmas).finally(() => {
      searchLoading.value = false;
    });
    userlist.value = res.value;
  } catch (error) {}
};
watchEffect(() => {
  if (userlist.value.length > 0) {
    activeUser.value = userlist.value[0];
  }
});
const toggleActive = (item) => {
  activeUser.value = item;
};
const maxId = ref('');
const tweetList = ref([]);
const tweetLoading = ref(false);
const tweetFinished = ref(false);
const getTweetList = async (user, maxId) => {
  try {
    tweetLoading.value = true;
    const { data: res } = await getUnlockTweetList(user.id, maxId).finally(() => {
      tweetLoading.value = false;
    });
    if (user.unread_num) {
      subscribeNum.value = Math.max(subscribeNum.value - user.unread_num, 0);
      user.unread_num = 0;
    }
    tweetList.value.push(...res.value.data);
    if (tweetList.value.length >= res.value.total) {
      tweetFinished.value = true;
    }
  } catch (error) {
    tweetLoading.value = false;
    console.log(`output->error`, error);
  }
};
const getList = (params) => {
  if (tweetList.value.length > 0) {
    maxId.value = tweetList.value[tweetList.value.length - 1]?.id || '';
  }
  getTweetList(activeUser.value, maxId.value);
};
// 切换查看用户
watch(
  () => activeUser.value,
  (newVal) => {
    if (newVal) {
      tweetList.value = [];
      maxId.value = '';
      tweetFinished.value = false;
      getTweetList(newVal, maxId.value);
    }
  },
  {
    immediate: true,
  }
);
const router = useRouter();
const subscribe = () => {
  router.push(`/user/${activeUser.value.acct}`);
};
</script>

<template>
  <div class="pages">
    <div class="user-menu">
      <div class="column-title">{{ t('subscribed.paidSubscribed') }}</div>
      <div class="column-form">
        <a-input-search :placeholder="t('common.search')" v-model="searchPost.input" @search="searchUser" />
        <div class="column-item">
          <a-checkbox v-model="searchPost.isHidden" @change="searchUser">{{ t('subscribed.hideExpiredSubscribed') }}</a-checkbox>
          <a-link @click="readAll">{{ t('subscribed.markAllAsRead') }}</a-link>
        </div>
      </div>
      <a-spin class="column-userlist" :loading="searchLoading">
        <div class="user-item" v-for="item in userlist" :class="{ active: activeUser.acct === item.acct }" @click="toggleActive(item)">
          <div class="avatar">
            <a-avatar>
              <img :src="renderImage(item.avatar)" alt="avatar" />
            </a-avatar>
          </div>
          <div class="info">
            <div class="line">
              <div class="info-name">{{ item.display_name }}</div>
              <div class="info-acct">@{{ item.acct || 'acct' }}</div>
            </div>
            <div class="line">
              <div class="info-tags">
                <a-tag color="purple" v-if="item.state === 1">{{ t('subscribed.subscribed') }}</a-tag>
                <a-tag color="gray" v-else-if="item.state === 3">{{ t('subscribed.expired') }}</a-tag>
                <a-tag color="arcoblue" v-if="item.unlock_num">{{ t('subscribed.unlocked', { count: item.unlock_num }) }}</a-tag>
              </div>
            </div>
          </div>
          <div class="unread">
            <div class="unread-num" v-if="item.unread_num">{{ item.unread_num }}</div>
          </div>
        </div>
      </a-spin>
    </div>
    <div class="main-menu">
      <div class="column-title">{{ activeUser?.display_name }}</div>
      <div class="column-main">
        <tweetMessages :tweetList="tweetList" :loading="tweetLoading" @load="getList" :finished="tweetFinished"> </tweetMessages>
        <template v-if="!tweetList.length && !tweetLoading">
          <div class="noTweetList">
            <div>{{ t('subscribed.expiredSubscribed') }}</div>
            <a-button type="primary" @click="subscribe">{{ t('subscribed.reSubscribe') }}</a-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pages {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  .user-menu {
    width: 320px;
    border-right: 1px solid var(--color-fill-3);
    height: 100%;
  }
  .main-menu {
    flex: 1;
    overflow-y: scroll;
    height: 100%;
  }
  .column-title {
    --height: 49px;
    height: var(--height);
    line-height: var(--height);
    text-align: center;
    border-bottom: 1px solid var(--color-fill-3);
    font-size: 16px;
    font-weight: 500;
  }
  .column-form {
    padding: 10px;
    .column-item {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
  }
  .column-userlist {
    display: flex;
    flex-direction: column;
    padding: 10px;
    padding-top: 0;
    gap: 8px;
    .user-item {
      display: flex;
      padding: 12px;
      border-radius: 6px;
      &.active {
        background-color: var(--color-fill-1);
      }
      .avatar {
        margin-right: 10px;
      }
      .info {
        flex: 1;
        .line {
          display: flex;
          gap: 4px;
          .info-name {
            font-size: 14px;
            font-weight: 500;
          }
          .info-acct {
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            text-align: left;
            color: #3c3c4399;
            color: rgb(var(--gray-6));
          }
        }
      }
      // 未读
      .unread {
        display: flex;
        margin-left: auto;
        justify-content: center;
        align-items: center;
        .unread-num {
          --size: 22px;
          padding: 0px 7px 0px 7px;
          border-radius: 100px;
          height: var(--size);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(var(--arcoblue-6), 1);

          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          text-align: left;
        }
      }
    }
    .info-tags {
      display: flex;
      gap: 4px;
    }
  }
  .noTweetList {
    height: 142px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    text-align: left;
  }
}
</style>
