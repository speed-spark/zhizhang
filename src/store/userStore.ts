import { ref, computed } from "@vue-mini/core";
import { defineStore } from "@vue-mini/pinia";
import { LoginResponse } from "../lib/type";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<LoginResponse["data"] | null>(null);
  const categoryMap = computed(() => {
    if (!userInfo.value) return {};
    return JSON.parse(userInfo.value.categoryMap ?? "");
  });

  const onLogin = () => {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: "http://localhost:8787/api/login",
            method: "POST",
            data: { code: res.code },
            dataType: "json",
            success: (res) => {
              console.log("登录成功", res);
              const { data } = res.data as LoginResponse;
              userInfo.value = data;
              wx.setStorage({
                key: "userInfo",
                data: data,
              });
            },
            fail: () => {
              // 这里只处理网络请求失败的情况
              wx.showToast({
                title: "网络请求失败",
                icon: "error",
                duration: 2000,
              });
            },
          });
        }
      },
    });
  };
  return { userInfo, onLogin, categoryMap };
});
