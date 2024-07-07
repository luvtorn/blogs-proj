import { createBrowserRouter } from "react-router-dom";
import Blogs from "../pages/Blogs";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateBlog from "../pages/CreateBlog";
import BlogPage from "../pages/BlogPage";
import ChangeBlog from "../pages/ChangeBlog";
import BlogsByTagPage from "../components/BlogsByTagPage";
import ProfilePage from "../pages/ProfilePage";
import ChangeUserInfo from "../pages/ChangeUserInfo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Blogs />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/create",
    element: <CreateBlog />,
  },
  {
    path: "/blog/:id",
    element: <BlogPage />,
  },
  {
    path: "/change/:id",
    element: <ChangeBlog />,
  },
  {
    path: "/blogs/tag/:tag",
    element: <BlogsByTagPage />,
  },
  {
    path: "/profile/:id",
    element: <ProfilePage />,
  },
  {
    path: "/changeUser/:id",
    element: <ChangeUserInfo />,
  },
]);

export default router;
