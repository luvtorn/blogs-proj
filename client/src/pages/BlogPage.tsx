import ReactMarkdown from "react-markdown";
import "../styles/BlogPage.scss";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { blogStore } from "../stores/BlogStore";
import useHover from "../hooks/useHover";
import useData from "../hooks/useData";

const BlogPage = observer(() => {
  const navigate = useNavigate();
  const { isHovered, mouseOut, mouseOver } = useHover();
  const { id } = useParams();

  const blog = blogStore.getBlogById(Number(id))?.[0];

  const handleDelete = blogStore.deleteBlog({ id: Number(id), navigate });
  const handleChange = blogStore.changeBlog({ id: Number(id), navigate });

  useAuth();

  return (
    <>
      <Header />
      <div className="container blog-page-container">
        <button className="back" onClick={() => navigate(-1)}>
          Back
        </button>
        <div
          className="blog-page"
          onMouseOver={() => mouseOver(blog?.user_id)}
          onMouseOut={mouseOut}
        >
          {blog?.image_url && (
            <img
              src={`http://localhost:5000/${blog?.image_url}`}
              alt="picture"
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

          <div className="blog-page__title">
            <img
              src={`http://localhost:5000/${
                blog?.avatar_url !== null ? blog?.avatar_url : "/avatar.svg"
              }`}
              alt="avatar"
            />
            <div className="blog__text">
              <h4>{blog?.username}</h4>
              <p>{useData(blog?.created_at)}</p>
              <div className="blog-page__tags">
                {blog?.tags.map((tag) => (
                  <p key={tag.id}>{tag.name}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="blog-page__name">
            <h3>{blog?.title}</h3>
          </div>

          <ReactMarkdown className="blog-page__content">
            {blog?.content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
});

export default BlogPage;
