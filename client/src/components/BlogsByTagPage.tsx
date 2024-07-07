import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/Blog.service";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Blog from "./Blog";
import Tags from "./Tags";
import Users from "./Users";

const BlogsByTagPage = () => {
  const { tag } = useParams();

  const { data } = useQuery({
    queryKey: ["blogsByTags", tag],
    queryFn: () => blogService.getBlogsByTags(Number(tag)),
    select: (data) => data,
    enabled: !!tag,
  });

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
