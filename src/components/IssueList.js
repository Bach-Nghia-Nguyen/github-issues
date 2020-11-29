import React from "react";
import { Media } from "react-bootstrap";
// import ReactMarkdown from "react-markdown";
import Moment from "react-moment";

const Item = ({ item, showDetail }) => {
  return (
    <Media as="li" className="mb-5 issue " onClick={() => showDetail(item)}>
      <img
        width={150}
        height={150}
        className="list-avatar mr-3"
        src={item.user.avatar_url}
        alt="User avatar"
      />
      <Media.Body className="text-left">
        <h4>
          <span className="badge badge-info">#{item.number}</span>
          <span className="list-issue-title">{item.title}</span>
        </h4>
        <div className="content-body">
          <span className="text-grey mr-3">@{item.user.login} |</span>
          <span className="text-grey mr-3">
            Last update: <Moment fromNow>{item.updated_at}</Moment> |
          </span>
          <span className="text-grey mr-3">Comment: {item.comments}</span>
          <p>
            {item.body.length <= 100
              ? item.body
              : item.body.slice(0, 99) + "..."}
          </p>
        </div>

        <div className="content-footer">
          {item.labels.map((label) => (
            <span
              className="badge badge-secondary mr-2"
              color={label.color}
              key={label.id}
            >
              {label.name}
            </span>
          ))}
        </div>
      </Media.Body>
    </Media>
  );
};

const IssueList = ({ itemList, showDetail }) => {
  return (
    <ul className="list-unstyled ">
      {itemList.map((item) => (
        <Item key={item.id} item={item} showDetail={showDetail} />
      ))}
    </ul>
  );
};

export default IssueList;
