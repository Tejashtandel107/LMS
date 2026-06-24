export const redirectPathByRole = (user) => {
  const role = user?.userRole?.toLowerCase();

  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "instructor":
      return "/instructor/courses";

    case "student":
      return "/student/learning";

    default:
      return "/";
  }
};