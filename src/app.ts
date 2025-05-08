import { createApp } from "@vue-mini/core";
import { createPinia, storeToRefs } from "@vue-mini/pinia";
import { useUserStore } from "./store/userStore";
import { baseUrl } from "./config";

export const pinia = createPinia();

createApp(() => {
  const userStore = useUserStore();
  const { userId, categoryMap } = storeToRefs(userStore);

  // 尝试从本地存储拿数据
  const id = wx.getStorageSync("userId");
  const category = wx.getStorageSync("userCategory");
  if (id) userId.value = id;
  if (category) categoryMap.value = JSON.parse(category);

  return {
    baseUrl,
  };
});
