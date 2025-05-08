import { defineComponent, ref } from "@vue-mini/core";
import dayjs from "dayjs";
import { storeToRefs } from "@vue-mini/pinia";
import { useUserStore } from "../../store/userStore";

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
  const transactionList = ref();
  const userStore = useUserStore();
  const { userId } = storeToRefs(userStore);
  const app = getApp();

  const onData = () => {
    console.log("app.baseUrl", app.baseUrl);

    if (!userId.value) {
      wx.showToast({
        title: "请先登录",
        icon: "error",
        duration: 2000,
      });
      return;
    }
    wx.request({
      url: app.baseUrl + `api/transactions/${userId.value}`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          console.log("列表数据", res);
          const { data } = res.data as { data: [] };
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

  return {
    onData,
    transactionList,
  };
});
