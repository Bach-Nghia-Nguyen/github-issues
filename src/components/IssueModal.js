import React from "react";
import { Button, Media, Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { MoonLoader } from "react-spinners";

const Comments = ({ user, body, created_at }) => {
  return (
    <Media as="li" className="mb-3">
      <img
        src={user.avatar_url}
        alt="User Avatar"
        className="modal-avatar mr-3"
      />
      <Media.Body class="text-left">
        <div>
          <span className="text-grey mr-2">@{user.login}</span>
          <span className="text-grey">
            commented <Moment fromNow>{created_at}</Moment>
          </span>
        </div>
        <ReactMarkdown source={body} />
      </Media.Body>
    </Media>
  );
};

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
      >
        <Modal.Header closeButton>
          <Modal.Title id="issue-detail-modal">
            <span className="mr-2 badge badge-info">#{issue.number}</span>
            <span>{issue.title}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ReactMarkdown source={issue.body} className="issueModal" />

          <hr />

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

          <div className="d-flex flex-row justify-content-center align-items-center">
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

export default IssueModal;
