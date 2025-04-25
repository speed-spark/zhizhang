import { defineComponent, ref } from "@vue-mini/core";
import dayjs from "dayjs";

// 添加时间格式化函数
const formatDate = (time: string): string => {
  // 解析时间字符串
  const parsedTime = dayjs(time);

  // 如果解析失败，返回原字符串
  if (!parsedTime.isValid()) {
    return time;
  }

  // 转换为本地时间
  return parsedTime.locale("zh-cn").format("YYYY-MM-DD HH:mm:ss");
};

defineComponent(() => {
  const greeting = ref("欢迎使用 Vue Mini");
  const userInfo = ref();
  const transactionList = ref();

  const onData = () => {
    console.log("gg", userInfo.value);
    if (!userInfo.value) {
      wx.showToast({
        title: "请先登录",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    // https://ledger-core-backend.elevenzjx.workers.dev/
    // http://localhost:8787/
    wx.request({
      url: `https://ledger-core-backend.elevenzjx.workers.dev/api/transactions/${userInfo.value.id}`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          console.log("列表数据", res);
          const { data } = res.data;
          transactionList.value = data.map((item) => ({
            ...item,
            time: formatDate(item.time),
          }));
        }
        if (res.statusCode === 400) {
          wx.showToast({
            title: res.data.error.issues[0].message,
            icon: "error",
            duration: 2000,
          });
        }
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
  };

  const onLogin = () => {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: "https://ledger-core-backend.elevenzjx.workers.dev/api/login",
            method: "POST",
            data: { code: res.code },
            dataType: "json",
            success: (res) => {
              const { data } = res.data;
              wx.setStorage({
                key: "userInfo",
                data: data,
              });
              userInfo.value = data;
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
  return {
    userInfo,
    greeting,
    onLogin,
    onData,
    transactionList,
  };
});
