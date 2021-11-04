import github from "./db";

import { useEffect, useState, useCallback } from "react";

import query from "./Query";
import SearchBox from "./SearchBox";
import NavButtons from "./NavButtons";
import RepoInfo from "./RepoInfo";

function App() {
  const [userName, setUserName] = useState("");
  const [repoList, setRepoList] = useState(null);
  const [pageCount, setPageCount] = useState(10);
  const [queryString, setQueryString] = useState("");
  const [totalCount, setTotalCount] = useState(null);

  const [startCursor, setStartCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [paginationKeyword, setPaginationKeyword] = useState("first");
  const [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(
      query(pageCount, queryString, paginationKeyword, paginationString)
    );
    fetch(github.baseUrl, {
      method: "POST",
      headers: github.headers,
      body: queryText
    })
      .then(response => response.json())
      .then(data => {
        const viewer = data.data.viewer;
        const repos = data.data.search.edges;
        const total = data.data.search.repositoryCount;
        const start = data.data.search.pageInfo?.startCursor;
        const end = data.data.search.pageInfo?.endCursor;
        const next = data.data.search.pageInfo?.hasNextPage;
        const prev = data.data.search.pageInfo?.hasNextPage;
        setRepoList(repos);
        setUserName(viewer.name);
        setTotalCount(total);
        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);
      })
      .catch(error => {
        console.log(error);
      });
  }, [pageCount, queryString, paginationString, paginationKeyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill">Repos</i>
      </h1>
      <p>Hey there is : {userName}</p>

      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={myNumber => setPageCount(myNumber)}
        onQueryChange={myQueryString => setQueryString(myQueryString)}
      />
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        prev={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      />
      {repoList &&
        repoList.map(repo => <RepoInfo key={repo.node.id} repo={repo.node} />)}
    </div>
  );
}

export default App;
