<script setup>
import UserCardContent from '@/components/UserCard/content.vue';

const props = defineProps({
  account: { type: Object, default: () => null },
});
</script>

<template>
  <a-popover position="bl" trigger="hover">
    <slot></slot>
    <template #content>
      <UserCardContent :account="account"></UserCardContent>
    </template>
  </a-popover>
</template>

<style lang="scss">
@include respond('phone') {
  .arco-popover {
    &.arco-trigger-popup {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped></style>
