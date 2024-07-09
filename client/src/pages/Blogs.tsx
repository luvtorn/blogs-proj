import Header from "../components/Header";
import Blog from "../components/Blog";
import "../styles/Blogs.scss";
import Tags from "../components/Tags";
import Users from "../components/Users";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/Blog.service";
import useAuth from "../hooks/useAuth";
import { blogStore } from "../stores/BlogStore";

const Blogs = () => {
  const { getBlogs } = blogService;

  const { data } = useQuery({
    queryKey: ["blogs"],
    queryFn: () => getBlogs(),
    select: (data) => data,
  });

  console.log(data);

  useAuth();

  return (
    <div>
      <Header />
      <div className="container">
        <div className="blogs">
          {data?.map((blog) => (
            <Blog
              key={blog.blog_id}
              blog={{
                title: blog.title,
                tags: blog.tags,
                author: blog.username,
                authorId: blog.user_id,
                blogId: blog.blog_id,
                time: blog.created_at,
                avatar_url: blog.avatar_url,
              }}
            />
          ))}
        </div>
        <aside
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Tags />
          <Users />
        </aside>
      </div>
    </div>
  );
};

export default Blogs;
