import { createApp } from "@vue-mini/core";
import { createPinia, storeToRefs } from "@vue-mini/pinia";
import { useUserStore } from "./store/userStore";
import { LoginResponse } from "./lib/type";

export const pinia = createPinia();

createApp(() => {
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

  const info = wx.getStorageSync("userInfo");
  if (info) userInfo.value = info as LoginResponse["data"];

  console.log("App Launched!");
});
