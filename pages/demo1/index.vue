<script setup lang="ts">
console.log("test1");
</script>
<template>
  <div class="demo-container">
    <h1 class="title">demo1___i18n___:{{ $t("key") }}</h1>
    <VanButton type="success" @click="showNotify('notify')">button</VanButton>
  </div>
</template>

<style lang="less" scoped>
.demo-container {
  .title {
    color: #333;
    font-size: 24px;
    margin-bottom: 16px;
    background-color: pink;

    &:hover {
      color: #1890ff;
    }
  }
}
</style>
