import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getAllArticles,
  getMyArticles,
  search,
} from "../../store/actions/articlesActions";
// import Article from "../../components/Article/Article";
import WrappedLink from "../../components/WrappedLink/WrappedLink";
import { userLogoutRequest } from "../../store/actions/usersActions";
import "./Home.css";
// import Client from "../../ClientMongo";
import { Link } from "react-router-dom";
// import CustomPagination from "components/Pagination.js";
import debounce from "../../components/Debouncing/debounce";
import {ToastContainer} from 'react-toastify'


// const MATCHING_ITEM_LIMIT = 25;
class Home extends Component {
  state = {
    showMyArticles: false,
    page: 1,
    limit: 10,
    showRemoveIcon: false,
    searchValue: "",
    loading: false,
  };


  debouncedLog = debounce(text=>this.props.searchArticles(text),500)

  handleSearchChange = (e) => {
    this.setState({ loading: true });
    const value = e.target.value;

    this.setState({
      searchValue: value,
    });

    if (value === "") {
      this.setState({
        showRemoveIcon: false,
        loading: false,
      });
    } else {
      this.setState({
        showRemoveIcon: true,
      });
      this.debouncedLog(value)
      //  this.props.searchArticles(value);
     }
  };

  handleSearchCancel = () => {
    this.setState({
      showRemoveIcon: false,
      searchValue: "",
    });
    this.props.searchArticles("0");
  };

  componentWillMount() {
    if (
      this.props.location.pathname === "/article/myarticles" &&
      !this.state.showMyArticles
    ) {
      this.toggleShowMyArticles();
    }
    document.title = "Dashboard | vocab.js";
  }

  componentDidMount() {
    this.props.initArticles(this.state.page, this.state.limit);
    if (this.props.isAuthenticated) {
      this.props.getMyArticles();
    }
  }

  // handleEditArticleClick(param) {
  //     this.props.history.replace({pathname: '/article/edit/' + param});
  // }

  toggleShowMyArticles = () => {
    this.setState((prevState) => {
      return {
        showMyArticles: !prevState.showMyArticles,
      };
    });
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }

    // const { currentPage, postsPerPage, contacts, loading } = this.state;
    const { showRemoveIcon } = this.state;
    // const indexOfLastPost = page * limit;
    // const indexOfFirstPost = indexOfLastPost - postsPerPage;
    // const currentPosts = contacts.slice(indexOfFirstPost, indexOfLastPost);

    // const paginate = pageNum => this.setState({ page: pageNum });

    // const nextPage = () => this.setState({ page: currentPage + 1 });

    // const prevPage = () => this.setState({ page: currentPage - 1 });

    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };
    let allArticles =
      this.props.allArticles ||
      JSON.parse(localStorage.getItem("BasicMERNStackAppAllArticles"));
    // allArticles = allArticles.map(article => (
    //     <Article
    //         key={article._id}
    //         id={article._id}
    //         title={article.Word} meaning={article.Meaning} />
    // ));
    const add = "-";
    let tableOfArticles = (
      <table className="ui celled table">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="ui fluid search">
                <div className="ui icon input">
                  <input
                    className="prompt"
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Search for a Word"
                    value={this.state.searchValue}
                    onChange={this.handleSearchChange}
                    size="80px"
                  />
                  <i className="search icon" />
                </div>
                <i
                  className="remove icon"
                  onClick={this.handleSearchCancel}
                  style={removeIconStyle}
                />
              </div>
            </th>
          </tr>
          <tr>
            <th>Word</th>
            <th>Meaning</th>
            <th>Mneomonic</th>
            <th>Usage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allArticles.map((article) => (
            <tr key={article.Word}>
              <td>{article.Word}</td>
              <td>{article.Meaning}</td>
              <td>{article.Mneomonic ? article.Mneomonic : add}</td>
              <td>{article.Usage ? article.Usage : add}</td>
              <td>
                {this.props.isAuthenticated ? (
                  <WrappedLink
                    to={"/articles/" + article._id}
                    buttonClasses={["btn", "btn-primary", "ViewButton"]}
                  >
                    <i className="pencil icon"></i>
                  </WrappedLink>
                ) : (
                  <span style={{ color: "red" }}>Not Authorised</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    // let myArticles = [];
    // if (this.props.isAuthenticated && this.state.showMyArticles) {
    //   if (this.props.myArticles) {
    //     myArticles = [...this.props.myArticles];
    //   } else {
    //     myArticles = [
    //       ...JSON.parse(localStorage.getItem("BasicMERNStackAppMyArticles")),
    //     ];
    //   }
    //   myArticles = myArticles.map((article) => (
    //     <Article key={article._id} id={article._id} title={article.title} />
    //   ));
    // }

    // const showArticlesLink = (
    //   <Link
    //     to={this.state.showMyArticles ? "/" : "/article/myarticles"}
    //     className="Simple-Link"
    //     onClick={this.toggleShowMyArticles}
    //   >
    //     {this.state.showMyArticles ? "All Articles" : "My Articles"}
    //   </Link>
    // );

    return (
      <div className="container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <br />
        <div className="Header">
          <h1 className="heading">Dashboard</h1>
          {this.props.isAuthRole.authenticatedRole === process.env.REACT_APP_ROOT && (
            <Link to="/cp" className="Simple-Link">
              <i className="unlock alternate large icon"></i>
              <span className="item-label">Manage Access</span>
            </Link>
          )}
          {this.props.isAuthenticated && (
            <Link
              to="/"
              className="Simple-Link"
              onClick={this.props.userLogoutRequest}
            >
              <i className="sign out large icon"></i>
              <span className="item-label">Logout</span>
            </Link>
          )}
          {!this.props.isAuthenticated && (
            <Link to="/login" className="Simple-Link">
              <i className="sign in large icon"></i>
              <span className="item-label">Login</span>
            </Link>
          )}
          <Link to="/article/add" className="Simple-Link">
            <i className="plus  large icon"></i>
            <span className="item-label">Add Word</span>
          </Link>
          {/* {this.props.isAuthenticated && showArticlesLink} */}

          <Link to="/" className="Simple-Link">
            <i className="home large icon"></i>
            <span className="item-label">Home</span>
          </Link>
        </div>
        <br />
        <div>
          <section>
            <div className="Articles">
              {/* { this.state.showMyArticles ? myArticles : allArticles } */}
              {tableOfArticles}
              {/* <CustomPagination postsPerPage={limit} paginate={paginate} nextPage={nextPage} prevPage={prevPage} currentPage={page}/> */}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allArticles: state.articles.articles,
    myArticles: state.articles.myArticles,
    isAuthenticated: state.users.isAuthenticated,
    isAuthRole: state.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initArticles: (page, limit) => dispatch(getAllArticles(page, limit)),
    getMyArticles: () => dispatch(getMyArticles()),
    userLogoutRequest: () => dispatch(userLogoutRequest()),
    searchArticles: (query) => dispatch(search(query)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
