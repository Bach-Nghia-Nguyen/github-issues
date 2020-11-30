import React from "react";
import { Button, Media, Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { MoonLoader } from "react-spinners";

const IssueModal = ({
  issue,
  comments,
  loadingComments,
  showModal,
  setShowModal,
  handleMore,
  disableShowMore,
}) => {
  return (
    issue && (
      <Modal
        size="xl"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="issue-detail-modal"
        animation
      >
        <Modal.Header closeButton className="modal-title">
          <Modal.Title id="issue-detail-modal">
            <span className="mr-2 badge badge-info">#{issue.number}</span>
            <span>{issue.title}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ReactMarkdown source={issue.body} className="issueModal" />

          <hr className="horizontal-line" />

          <h4>Comments:</h4>
          <ul className="list-unstyled">
            {comments && comments.length ? (
              comments.map((comment) => (
                <Comments key={comment.id} {...comment} />
              ))
            ) : (
              <li>There are no comments of this issue</li>
            )}
          </ul>

          <div className="d-flex justify-content-center">
            {loadingComments ? (
              <MoonLoader color="#f86c6b" size={75} loading={loadingComments} />
            ) : (
              <>
                {!disableShowMore && (
                  <Button
                    type="button"
                    onClick={handleMore}
                    disabled={disableShowMore}
                  >
                    Show more
                  </Button>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    )
  );
};

const Comments = ({ user, body, created_at }) => {
  return (
    <Media as="li" className="mb-3 mt-3 comment">
      <Media.Body className="text-left">
        <div className="mb-2 comment-header">
          <span>
            <img
              src={user.avatar_url}
              alt="User Avatar"
              className="modal-avatar mr-2"
            />
          </span>
          <span className="comment-user-name mr-2">@{user.login}</span>
          <span className="text-grey">
            commented <Moment fromNow>{created_at}</Moment>
          </span>
        </div>
        <div className="comment-content">
          <ReactMarkdown source={body} />
        </div>
      </Media.Body>
    </Media>
  );
};

export default IssueModal;
