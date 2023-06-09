import { useEffect, useState } from "react";
import NavbarDiscover from "../components/NavbarDiscover";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleBlog from "../components/SingleBlog";
import { AppState, Blog, User } from "../types/types";
import LoadingSpinner from "../components/LoadingSpinner";
import { arrayBufferToBase64ImgSrc } from "../utils/utils";
import Support from "../components/Support";
import NFT from "../components/NFT";

const API_URL_USERS = import.meta.env.VITE_APP_API_URL_USERS;

function ProfilePage() {
  const token = useSelector((state: AppState) => state.app.user.token);
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BLOG_LIMIT = 6;
  const [displayedBlogs, setDisplayedBlogs] = useState<number>(BLOG_LIMIT);

  useEffect(() => {
    async function findUser() {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL_USERS}${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.data;
        setCurrentUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    findUser();
  }, [id, token]);

  const currentUserBlogs = currentUser?.blogs || [];

  const showMoreBlogs = () => {
    if (currentUserBlogs.length > displayedBlogs) {
      setDisplayedBlogs(displayedBlogs + BLOG_LIMIT);
    }
  };

  return (
    <div className="flex flex-col flex-grow max-w-[90rem] xl:mx-auto w-full h-full pb-4">
      <NavbarDiscover />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="px-12">
          <div className="flex md:flex-row items-center justify-center flex-col gap-12 mb-8 relative">
            <div className="mb-4">
              {currentUser && (
                <div className="flex flex-col gap-2 items-center rounded-lg bg-gray-100 p-10">
                  <img
                    className="h-40 w-40 border-4 border-black rounded-full cursor-pointer hover:shadow-2xl"
                    src={arrayBufferToBase64ImgSrc(currentUser.img.data)}
                    alt="Profile"
                  />
                  <h2 className="text-4xl font-bold mt-2 mb-1">
                    {currentUser?.username}
                  </h2>
                  <h4 className="text-xl">{currentUser?.email}</h4>
                </div>
              )}
            </div>
            <Support
              page="profile"
              eth_address={currentUser?.ethereum_address}
            />
          </div>

          <div className="h-full w-full pt-1">
            <div>
              <h1 className="font-bold text-xl">Latest Blogs</h1>
              <div className="flex flex-wrap gap-4 my-6">
                {currentUser &&
                  currentUser.blogs
                    .slice(0, displayedBlogs)
                    .map((blog: Blog, index: number) => {
                      return (
                        <SingleBlog
                          id={blog._id}
                          key={index}
                          index={index}
                          hoveredIndex={hoveredIndex}
                          setHoveredIndex={setHoveredIndex}
                          img={blog.img}
                          title={blog.title}
                          date={blog.date}
                          tags={blog.tags}
                        />
                      );
                    })}
                {isLoading
                  ? null
                  : currentUserBlogs?.length > displayedBlogs && (
                      <div className="w-full text-center my-4">
                        <button
                          onClick={showMoreBlogs}
                          className="px-4 py-2 mb-4 font-bold border-[3px] text-sm border-black rounded-3xl hover:text-white hover:bg-black transition duration-500"
                        >
                          View More
                        </button>
                      </div>
                    )}
              </div>
            </div>
          </div>
        </div>
      )}
      <NFT />
    </div>
  );
}

export default ProfilePage;
