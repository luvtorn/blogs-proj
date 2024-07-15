import ReactMarkdown from "react-markdown";
import "../styles/BlogPage.scss";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { blogStore } from "../stores/BlogStore";
import useHover from "../hooks/useHover";
import BlogTitle from "../components/BlogTitle";
import Comments from "../components/Comments";

const BlogPage = observer(() => {
  const navigate = useNavigate();
  const { isHovered, mouseOut, mouseOver } = useHover();
  const { id } = useParams();

  const blog = blogStore.getBlogById(Number(id))?.[0];

  const handleDelete = blogStore.deleteBlog({ id: Number(id), navigate });
  const handleChange = blogStore.changeBlog({ id: Number(id), navigate });

  useAuth();

  if (!blog) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Header />
      <div className="container blog-page-container">
        <button className="back" onClick={() => navigate(-1)}>
          Back
        </button>
        <div
          className="blog-page"
          onMouseOver={() => mouseOver(blog.user_id)}
          onMouseOut={mouseOut}
        >
          {blog.image_url && (
            <img
              src={`http://localhost:5000/${blog.image_url}`}
              alt="picture"
              style={{ borderRadius: "10px" }}
            />
          )}

          {isHovered && (
            <div className="blog__edit-btns">
              <button onClick={handleChange}>
                <MdEdit size={"17px"} />
              </button>
              <button onClick={handleDelete}>
                <MdDelete size={"17px"} />
              </button>
            </div>
          )}
          <BlogTitle
            blog={{
              author: blog.username,
              avatar_url: blog.avatar_url,
              created_at: blog.created_at,
              tags: blog.tags,
              title: blog.title,
            }}
          />

          <div className="blog-page__name">
            <h3>{blog.title}</h3>
          </div>

          <ReactMarkdown className="blog-page__content">
            {blog.content}
          </ReactMarkdown>
          <Comments />
        </div>
      </div>
    </>
  );
});

export default BlogPage;
