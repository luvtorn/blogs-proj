import { HiOutlineHashtag } from "react-icons/hi";
import "../styles/Tags.scss";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/Blog.service";
import { useNavigate } from "react-router-dom";

const Tags = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => blogService.getTags(),
    select: (data) => data,
  });

  const navigate = useNavigate();

  if (isLoading) {
    return <h4>Loading...</h4>;
  }

  const handleTagClick = (id: number) => {
    navigate(`/blogs/tag/${id}`);
  };

  return (
    <div className="tags">
      <h4>Tags</h4>
      <br />
      <div className="tags__item">
        {data?.map((tag) => (
          <div
            className="tag"
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
          >
            <HiOutlineHashtag />
            <span className="tag__name">{tag.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
