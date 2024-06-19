import React, { useState, useEffect, useContext } from 'react';
import { fetchPosts, saveNoticeClub } from '../../api/board/BoardApi';
import PostNoticeClub from './PostNoticeClub';
import { Button, Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { AuthContext } from '../../AuthContext'; // Assuming your AuthContext is defined similarly

const NoticeClubBoard = () => {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const { role } = useContext(AuthContext); // Assuming AuthContext provides role information

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts('/noticeClub/findAll');
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('게시글 불러오기 에러:', error);
      }
    };
    loadPosts();
  }, []);

  const handlePostFormSubmit = async (postData) => {
    try {
      await saveNoticeClub(postData);
      console.log('게시글이 등록되었습니다!');
      setShowPostForm(false);
      const fetchedPosts = await fetchPosts('/noticeClub/findAll');
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h1>동아리 행사 공지</h1>
        </Col>
      </Row>
      {showPostForm ? (
        <PostNoticeClub onPostSubmit={handlePostFormSubmit} onCancel={() => setShowPostForm(false)} />
      ) : (
        <>
          {role === 'MASTER_MEMBER' && ( // Conditionally render based on role
            <Row className="mb-4">
              <Col>
                <Button variant="primary" onClick={() => setShowPostForm(true)}>게시글 등록</Button>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <h2>게시글 목록</h2>
              <ListGroup>
                {posts.map((post) => (
                  <ListGroup.Item key={post.id} className="d-flex align-items-start">
                    {post.imageRoute && (
                      <Image
                        src={`http://localhost:8080/master/board/image/${post.imageRoute}`}
                        rounded
                        className="me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="flex-grow-1">
                      <h5>제목: {post.title}</h5>
                      <p className="mb-1">작성자: {post.writer}</p>
                      <p>내용: {post.content}</p>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default NoticeClubBoard;
