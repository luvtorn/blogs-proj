import ReactMarkdown from "react-markdown";
import "../styles/BlogPage.scss";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/Blog.service";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { blogStore } from "../stores/BlogStore";
import useHover from "../hooks/useHover";
import useData from "../hooks/useData";

const BlogPage = () => {
  const navigate = useNavigate();
  const { isHovered, mouseOut, mouseOver } = useHover();
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["blog"],
    queryFn: () => blogService.getBlog(Number(id)),
    select: (data) => data,
  });

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
          onMouseOver={() => mouseOver(data?.rows[0].user_id)}
          onMouseOut={mouseOut}
        >
          {data?.rows[0].image_url && (
            <img
              src={`http://localhost:5000/${data?.rows[0].image_url}`}
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
            <img src="/avatar.svg" alt="avatar" />
            <div className="blog__text">
              <h4>{data?.rows[0].username}</h4>
              <p>{useData(data?.rows[0].created_at)}</p>
              <div className="blog-page__tags">
                {data?.tags.map((tag) => (
                  <p key={tag.id}>{tag.name}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="blog-page__name">
            <h3>{data?.rows[0].title}</h3>
          </div>

          <ReactMarkdown className="blog-page__content">
            {data?.rows[0].content}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
