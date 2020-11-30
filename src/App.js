import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Alert } from "react-bootstrap";
import { ScaleLoader } from "react-spinners";

import PublicNavbar from "./components/PublicNavbar";
import IssueList from "./components/IssueList";
import PaginationBar from "./components/PaginationBar";
import IssueModal from "./components/IssueModal";
import SearchForm from "./components/SearchForm";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("facebook/react");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [issues, setIssues] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalPageNum, setTotalPageNum] = useState(1);

  const [commentPageNum, setCommentPageNum] = useState(1);
  const [commentTotalPageNum, setCommentTotalPageNum] = useState(1);
  const [urlFetchComments, setUrlFetchComments] = useState("");
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);

  function getOwnerAndRepo() {
    const repo = searchInput.substring(searchInput.lastIndexOf("/") + 1);
    const withoutRepo = searchInput.substring(0, searchInput.lastIndexOf("/"));
    const owner = withoutRepo.substring(withoutRepo.lastIndexOf("/") + 1);
    return { owner, repo }; // ???
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    // searchInput = owner/repo
    const { owner, repo } = getOwnerAndRepo();
    const temp = searchInput.split("/");
    if (temp.length === 2) {
      setOwner(owner);
      setRepo(repo);
    } else if (
      temp[0] === "https:" &&
      temp[1] === "" &&
      temp[2] === "github.com"
    ) {
      setOwner(owner);
      setRepo(repo);
    } else {
      setErrorMessage("Wrong format of search input");
    }
  };

  const showDetail = (item) => {
    setShowModal(true);
    if (
      selectedIssue?.number !== item.number ||
      selectedIssue?.number === item.number
    ) {
      setComments([]);
      setCommentPageNum(1);
      setCommentTotalPageNum(1);
      setSelectedIssue(item);
      setUrlFetchComments(
        `https://api.github.com/repos/${owner}/${repo}/issues/${item.number}/comments?page=1&per_page=5`
      );
    }
  };

  const handleMoreComments = () => {
    if (commentPageNum >= commentTotalPageNum) return;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${
      selectedIssue.number
    }/comments?page=${commentPageNum + 1}&per_page=5`;
    setCommentPageNum((num) => num + 1);
    setUrlFetchComments(url);
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!urlFetchComments && !showModal) return;
      setLoadingComments(true);
      try {
        const response = await fetch(urlFetchComments);
        const data = await response.json();
        if (response.status === 200) {
          const link = response.headers.get("link");
          if (link) {
            const getTotalPage = link.match(
              /page=(\d+)&per_page=\d+>; rel="last"/
            );
            if (getTotalPage) {
              setCommentTotalPageNum(parseInt(getTotalPage[1]));
            }
          }
          setComments((c) => [...c, ...data]);
          setErrorMessage(null);
        } else {
          setErrorMessage(`FETCH COMMENTS ERROR: ${data.message}`);
          setShowModal(false);
        }
        console.log(data);
      } catch (error) {
        setErrorMessage(`FETCH COMMENTS ERROR: ${error.message}`);
        setShowModal(false);
      }
      setLoadingComments(false);
    };
    fetchComments();
  }, [urlFetchComments, showModal]);

  useEffect(() => {
    const fetchIssueData = async () => {
      if (!owner || !repo) return;
      setLoading(true);
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/issues?page=${pageNum}&per_page=20`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {
          const link = response.headers.get("link");
          if (link) {
            const getTotalPage = link.match(
              /page=(\d+)&per_page=\d+>; rel="last"/
            );
            if (getTotalPage) setTotalPageNum(Number(getTotalPage[1]));
          }
          setIssues(data);
          setErrorMessage(null);
        } else {
          setErrorMessage(`FETCH ISSUES ERROR: ${data.message}`);
          setIssues([]);
        }
      } catch (error) {
        setErrorMessage(`FETCH ISSUES ERROR: ${error.message}`);
      }
      setLoading(false);
    };
    fetchIssueData();
  }, [owner, repo, pageNum]);

  return (
    <div className="text-center">
      <PublicNavbar />
      <Container>
        <h1>Github Issues</h1>
        <SearchForm
          loading={loading}
          searchInput={searchInput}
          handleInputChange={handleSearchInputChange}
          handleSubmit={handleSearchFormSubmit}
        />

        {errorMessage && (
          <Alert variant="danger" className="mt-4">
            {errorMessage}
          </Alert>
        )}

        {issues.length > 0 && !loading && (
          <PaginationBar
            pageNum={pageNum}
            setPageNum={setPageNum}
            totalPageNum={totalPageNum}
          />
        )}

        {loading ? (
          <div className="loader-div d-flex flex-row justify-content-center align-items-center">
            <ScaleLoader
              color="#3F3BA7"
              height={100}
              width={20}
              radius={50}
              margin={5}
              loading={loading}
            />
          </div>
        ) : (
          <IssueList itemList={issues} showDetail={showDetail} />
        )}

        {issues.length > 0 && !loading && (
          <PaginationBar
            pageNum={pageNum}
            setPageNum={setPageNum}
            totalPageNum={totalPageNum}
          />
        )}

        <IssueModal
          issue={selectedIssue}
          comments={comments}
          loadingComments={loadingComments}
          showModal={showModal}
          setShowModal={setShowModal}
          handleMore={handleMoreComments}
          disableShowMore={commentPageNum === commentTotalPageNum}
        />
      </Container>
    </div>
  );
};

export default App;
