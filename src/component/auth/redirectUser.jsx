export const redirectUser = (user, navigate) => {
  const role = user?.userRole?.toLowerCase();

  switch (role) {
    case "admin":
      navigate("/admin/dashboard");
      break;

    case "instructor":
      navigate("/instructor/courses");
      break;

    default:
      navigate("/");
      break;
  }
};