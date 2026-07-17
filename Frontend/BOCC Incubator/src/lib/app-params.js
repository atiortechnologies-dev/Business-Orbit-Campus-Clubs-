const isNode = typeof window === "undefined";

const getAppParams = () => {
  if (isNode) {
    return {
      token: null,
      fromUrl: "",
    };
  }

  return {
    token: localStorage.getItem("token") || null,
    fromUrl: window.location.href,
  };
};

export const appParams = getAppParams();