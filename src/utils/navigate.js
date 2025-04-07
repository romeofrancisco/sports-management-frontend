let navigate;

export const setNavigate = (navFunc) => {
  navigate = navFunc;
};

export const navigateTo = (path) => {
  if (navigate) {
    navigate(path);
  } else {
    console.warn("Navigate function is not set yet.");
  }
};
