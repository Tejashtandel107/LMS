import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from 'react'

import Home from "./component/Home";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import ForgotPassword from "./component/auth/ForgotPassword";
import ResetPassword from "./component/auth/ResetPassword";
import GoogleRedirect from "./component/auth/GoogleRedirect";

import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";

// Student
import MyLearning from "./component/pages/student/MyLearning";
import BecomeInstructor from "./component/pages/student/BecomeInstructor";

// Instructor
import ManageCourses from "./component/pages/instructor/ManageCourses";
import CreateCourse from "./component/pages/instructor/CreateCourse";
import ManageLessons from "./component/pages/instructor/ManageLessons";

// Admin
import AdminDashboard from "./component/pages/admin/AdminDashboard";
import AdminUsers from "./component/pages/admin/AdminUsers";
import AdminCourses from "./component/pages/admin/AdminCourses";
import AdminCategories from "./component/pages/admin/AdminCategories";
import InstructorRequests from "./component/pages/admin/InstructorRequests";
import NotFound from "./component/pages/NotFound";
import AddLesson from "./component/pages/instructor/AddLesson";
import EditLesson from "./component/pages/instructor/EditLesson";
import Profile from "./component/profile/Profile";
import Test from "./Test";
import AllCourses from "./component/app/AllCourses";
import CourseDetails from "./component/app/CourseDetails";
import AdminLessons from "./component/pages/admin/AdminLessons";
import StudentWishlist from "./component/pages/student/StudentWishlist";
import Checkout from "./component/pages/student/Checkout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = lazy(()=> import('./component/app/Cart'))

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test/>}/>
        <Route path="/course" element={<AllCourses/>}/>
        <Route path="/course/:id" element={<CourseDetails/>}/>

        {/* Auth Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
        <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />
        <Route path="/auth/google/callback" element={<GoogleRedirect />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={<ProtectedRoute allowedRoles={["student"]}><MyLearning />
          </ProtectedRoute>}
        />

        <Route
          path="/student/become-instructor"
          element={<ProtectedRoute allowedRoles={["student"]}><BecomeInstructor />
          </ProtectedRoute>}
        />

        <Route 
          path="/student/profile" 
          element={<ProtectedRoute allowedRoles={["student"]}><Profile />
          </ProtectedRoute>} 
        />

        <Route 
          path="/student/learning" 
          element={<ProtectedRoute allowedRoles={["student"]}><MyLearning />
          </ProtectedRoute>} 
        />

        {/* Student Cart */}
        <Route path="/student/cart" element={<ProtectedRoute allowedRoles={["student"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <Cart />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Student Wishlist */}
        <Route path="/student/wishlist" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Suspense fallback={<div>Loading...</div>}>
                <StudentWishlist />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        <Route path="/checkout" allowedRoles={["student"]} element={<Checkout />} />

        {/* <Route 
          path="/checkout/:documentId" allowedRoles={["student"]}
          element={<Suspense fallback={<div>Loading...</div>}><Checkout /></Suspense>}
        /> */}

        {/* Instructor Routes */}
        <Route
          path="/instructor/courses"
          element={<ProtectedRoute allowedRoles={["instructor"]}><ManageCourses />
          </ProtectedRoute>}
        />

        <Route
          path="/instructor/create-course"
          element={<ProtectedRoute allowedRoles={["instructor"]}><CreateCourse />
          </ProtectedRoute>}
        />

        <Route 
          path="/courses/edit/:id" 
          element={<ProtectedRoute allowedRoles={["instructor"]}><CreateCourse />
          </ProtectedRoute>} 
        />

        <Route
          path="/instructor/lessons"
          element={<ProtectedRoute allowedRoles={["instructor"]}><ManageLessons />
          </ProtectedRoute>}
        />

        <Route 
          path="/instructor/create-lessons" 
          element={<ProtectedRoute allowedRoles={["instructor"]}><AddLesson />
          </ProtectedRoute>} 
        />

        <Route 
          path="/instructor/edit-lesson/:documentId" 
          element={<ProtectedRoute allowedRoles={["instructor"]}><EditLesson />
          </ProtectedRoute> }
        />

        <Route
          path="/instructor/profile"
          element={<ProtectedRoute allowedRoles={["instructor"]}><Profile />
          </ProtectedRoute>}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
        />

        <Route
          path="/admin/users"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>}
        />

        <Route
          path="/admin/courses"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminCourses /></ProtectedRoute>}
        />

        <Route
          path="/admin/categories"
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminCategories /></ProtectedRoute>}
        />

        <Route
          path="/admin/instructor-requests"
          element={<ProtectedRoute allowedRoles={["admin"]}><InstructorRequests /></ProtectedRoute>}
        />
        <Route 
          path="/admin/profile" 
          element={<ProtectedRoute allowedRoles={["admin"]}><Profile /></ProtectedRoute>} 
        />

        <Route 
          path="/admin/lessons" 
          element={<ProtectedRoute allowedRoles={["admin"]}><AdminLessons /></ProtectedRoute>} 
        />

         <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer />
    </>
    
    
  );
}

export default App;