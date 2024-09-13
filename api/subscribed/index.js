import { manualFetch } from '~/api/base';
export const getAccountList = (params) => {
  return useMyFetch('/_api/subscribe/account', {
    method: 'get',
    params,
  });
};
// 获取解锁的推文
export const getUnlockTweetList = (id, maxId) => {
  return useMyFetch(`/_api/subscribe/account/${id}/status`, {
    method: 'get',
    params: {
      max_id: maxId,
    },
  });
}
// 全部已读
export const readAll = () => {
  return manualFetch('/_api/subscribe/account/read-all', {
    method: 'put',
  });
}