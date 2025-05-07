import { ref } from "@vue-mini/core";
import { defineStore } from "@vue-mini/pinia";
import { LoginResponse, Category } from "../lib/type";

export const useUserStore = defineStore("user", () => {
  const userId = ref("");
  const categoryMap = ref<Category[]>([]);
  const loginLoading = ref(false);

  const login = () => {
    loginLoading.value = true;
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: "http://localhost:8787/api/login",
            method: "POST",
            data: { code: res.code },
            dataType: "json",
            success: (res) => {
              const { data } = res.data as LoginResponse;
              userId.value = data.id;
              categoryMap.value = JSON.parse(data.categoryMap);
              wx.setStorage({
                key: "userInfo",
                data: data,
              });
              loginLoading.value = false;
            },
            fail: () => {
              // 这里只处理网络请求失败的情况
              wx.showToast({
                title: "网络请求失败",
                icon: "error",
                duration: 2000,
              });
              loginLoading.value = false;
            },
          });
        }
      },
    });
  };
  return { userId, categoryMap, login, loginLoading };
});
