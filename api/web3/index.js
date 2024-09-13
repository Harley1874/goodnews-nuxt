import { manualFetch } from '~/api/base';

export const getMessage = (options = {}) => {
  return manualFetch(`/_api/v1/wallet/message`, {
    method: 'get',
    ...options,
  });
};

// 验证签名
export const verifySignature = (params) => {
  return manualFetch(`/_api/v1/wallet/verify-signature`, {
    method: 'post',
    body: JSON.stringify(params),
  });
};

// 获取打赏记录
export const getRewards = (params) => {
  return manualFetch(`/_api/v1/reward`, {
    method: 'get',
    params,
  });
};

// 获取提现记录
export const getWithdraws = (params) => {
  return manualFetch(`/_api/v1/withdraw`, {
    method: 'get',
    params,
  });
};

// 提现接口
export const withdraw = (params) => {
  return manualFetch(`/_api/v1/withdraw`, {
    method: 'post',
    body: JSON.stringify(params),
  });
}