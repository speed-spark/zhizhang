import { defineComponent, ref } from "@vue-mini/core";
import { storeToRefs } from "@vue-mini/pinia";
import { useUserStore } from "../../store/userStore";
import { Category } from "../../lib/type";

defineComponent(() => {
  const userStore = useUserStore();
  const { login } = useUserStore();
  const { userId, categoryMap, loginLoading } = storeToRefs(userStore);

  const inputValue = ref("");
  const showAddInput = ref(false);

  // 拷贝Id
  const onCopyId = () => {
    wx.setClipboardData({
      data: userId.value ?? "",
    });
  };

  // 输入框变化
  const onInputChange = (e: WechatMiniprogram.Input) => {
    inputValue.value = e.detail.value;
  };

  // 更新分类
  const updateCategoryMap = (e: WechatMiniprogram.TouchEvent) => {
    const { type, label } = e.currentTarget.dataset;

    let categoryMapCopy = JSON.parse(
      JSON.stringify(categoryMap.value),
    ) as Category[];
    if (type === "add") {
      if (!inputValue.value.trim()) {
        wx.showToast({
          title: "请输入内容",
          icon: "none",
        });
        return;
      }
      categoryMapCopy.push({
        label: inputValue.value.trim(),
      });
    } else {
      categoryMapCopy = categoryMapCopy.filter((item) => item.label !== label);
    }

    wx.request({
      url: `http://localhost:8787/api/users/categoryMap/${userId.value}`,
      method: "PUT",
      data: {
        categoryMap: JSON.stringify(categoryMapCopy),
      },
      success: (res) => {
        console.log("更新成功", res);
        const { data } = res.data as { data: { categoryMap: string } };
        categoryMap.value = JSON.parse(data.categoryMap);
        inputValue.value = "";
      },
      fail: () => {
        wx.showToast({
          title: "网络请求失败",
          icon: "error",
          duration: 2000,
        });
      },
    });
  };

  return {
    inputValue,
    userId,
    categoryMap,
    showAddInput,
    loginLoading,
    login,
    updateCategoryMap,
    onCopyId,
    onInputChange,
  };
});
