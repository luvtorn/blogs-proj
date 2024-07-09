import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/Blog.service";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Blog from "./Blog";
import Tags from "./Tags";
import Users from "./Users";
import { blogStore } from "../stores/BlogStore";
import { useEffect } from "react";

const BlogsByTagPage = () => {
  const { tag } = useParams();

  useEffect(() => {
    blogStore.getBlogs();
  }, []);

  const data = blogStore.getBlogsByTag(Number(tag));

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
                author: blog.username,
                authorId: blog.user_id,
                blogId: blog.blog_id,
                time: blog.created_at,
                avatar_url: blog.avatar_url,
                tags: blog.tags,
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

export default BlogsByTagPage;
