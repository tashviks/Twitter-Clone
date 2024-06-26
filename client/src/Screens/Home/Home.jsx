import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../Actions/Post/createPost";
import { getPosts } from "../../Actions/Post/getPosts";
import Loader from "../../Components/Loader/Loader";
import Meta from "../../Components/Meta";
import ReplyModal from "../../Components/Modals/ReplyModal";
import PostForm from "../../Components/Post/PostForm";
import PostItem from "../../Components/Post/PostItem";

import "./index.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    listPosts: { posts, loading },
    createPost: { success: successCreate },
    updatePost: { success: successUpdate },
    selectedPost: { post },
  } = useSelector((state) => state.post);
  const {
    socketConnection: { socket },
  } = useSelector((state) => state.socket);

  // submit handler for creating new post
  const submitHandlerPost = (e, text) => {
    e.preventDefault();
    dispatch(createPost({ text }));
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    } else {
      dispatch(getPosts());
    }
  }, [user, dispatch, successCreate, successUpdate, navigate]);
  return (
    <>
      <ReplyModal show={show} handleClose={() => setShow(false)} post={post} user={user} setShow={setShow} socket={socket}/>
      <Meta title={`Twitter | Home`} />
      <Container fluid>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="titleContainer">
              <h1>Home</h1>
            </div>
            <PostForm user={user} submitHandler={submitHandlerPost} />
            <div className="postContainer">
              {posts &&
                posts.map((post) => (
                  <PostItem
                    key={post._id}
                    post={post}
                    liked={post.likes.includes(user._id) || false}
                    retweeted={post.retweetUsers.includes(user._id)}
                    setShow={setShow}
                    show={show}
                    userId={user._id}
                    socket={socket}
                  />
                ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;
