const regexes = {
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*])(?=.*[0-9]).{8,}$/,
};

export default regexes;
