const envConfig = {
  develop: {
    baseUrl: "http://localhost:8787/", // 开发环境
  },
  trial: {
    baseUrl: "https://oi11.top/", // 体验环境
  },
  release: {
    baseUrl: "https://oi11.top/", // 生产环境
  },
};

// 获取当前环境
const getEnv = () => {
  try {
    const accountInfo = wx.getAccountInfoSync();
    return accountInfo.miniProgram.envVersion || "develop"; // 默认开发环境
  } catch (error) {
    console.error("获取环境失败，默认使用开发环境:", error);
    return "develop";
  }
};

// 导出当前环境的配置
export const currentEnv = getEnv();
export const baseUrl = envConfig[currentEnv].baseUrl;
