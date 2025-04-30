import { defineComponent, ref } from "@vue-mini/core";
import { storeToRefs } from "@vue-mini/pinia";
import { useUserStore } from "../../store/userStore";

defineComponent(() => {
  const greeting = ref("希望你会喜欢");
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);
  console.log("userInfo", JSON.parse(userInfo.value?.categoryMap ?? ""));

  const onCopyId = () => {
    wx.setClipboardData({
      data: userInfo.value?.id ?? "",
    });
  };

  // const onUpdateCategoryMap = () => {
  //   wx.request({
  //     url: `/api/transactions/${userInfo.value?.id}`,
  //     method: "PATCH",
  //     data: { categoryMap: JSON.stringify(userInfo.value?.categoryMap ?? {}) },
  //     dataType: "json",
  //   });
  // };

  return {
    greeting,
    onCopyId,
    userInfo,
  };
});
