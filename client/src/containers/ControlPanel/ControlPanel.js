import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { search } from "../../store/actions/articlesActions";
import { getAllUsers } from "../../store/actions/roleActions";
// import Article from '../../components/Article/Article';
// import WrappedLink from '../../components/WrappedLink/WrappedLink';
import { userLogoutRequest } from "../../store/actions/usersActions";
import "./ControlPanel.css";
// import Client from "../../ClientMongo";
import { Link } from "react-router-dom";
// import CustomPagination from "components/Pagination.js";
import * as env from '../../config'

// const MATCHING_ITEM_LIMIT = 25;
class ControlPanel extends Component {
  state = {
    dummyArticle: [],
    page: 1,
    limit: 10,
    showRemoveIcon: false,
    searchValue: "",
    loading: false,
  };

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

      this.props.searchArticles(value);
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
    document.title = "Control Panel |vocab.js.org";
  }

  componentDidMount() {
    this.props.initArticles(this.state.page, this.state.limit);
  }

  // handleEditArticleClick(param) {
  //     this.props.history.replace({pathname: '/article/edit/' + param});
  // }
  handleDelete(article) {
    // console.log(article);
    fetch(`${env.HOST}/api/root/delete/` + article._id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        "Content-Type": "application/json",
      },
      method: "delete",
    }).then(this.props.initArticles(this.state.page, this.state.limit));
  }

  handleAdminChange(article) {
    fetch(`${env.HOST}/api/root/edit/?id=`+article._id+`&role=`+article.role, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(this.props.initArticles(this.state.page, this.state.limit));
  }

  render() {
    // console.log(this.props.allArticles )
    // this.props.initArticles(this.state.page,this.state.limit);
    if (this.props.isAuthenticated.authenticatedRole != 'ryJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzcxY2FlMjA0NTRjMDAxNWYzY2RhMSIsImVtYWlsIjoicGFsYXNoc2hhbnVAZ21haWwuY29tIiwiaWF0IjoxNjIyMjk4NjQzfQ.vKwYp8S43xan7wk1dkpY0Nn5uC6JGNPypcODIOF97F4') {
      return <Redirect to="/" />;
    }
  
    if (!this.props.isAuthenticated.isAuthenticated) {
      return <Redirect to="/" />;
    }

    // const { currentPage, postsPerPage, contacts, loading } = this.state;
    const { showRemoveIcon, page, limit, foods } = this.state;
    // const indexOfLastPost = page * limit;
    // const indexOfFirstPost = indexOfLastPost - postsPerPage;
    // const currentPosts = contacts.slice(indexOfFirstPost, indexOfLastPost);

    // const paginate = pageNum => this.setState({ page: pageNum });

    // const nextPage = () => this.setState({ page: currentPage + 1 });

    // const prevPage = () => this.setState({ page: currentPage - 1 });

    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };
    let allArticles =
      this.props.allArticles ||
      JSON.parse(localStorage.getItem("AllUsers")) ||
      this.state.dummyArticle;

    const add = "-";
    const ROLE = {
      ADMIN: 'ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzFjOTY3YzM1MmM0MDAxNTE5MDJmMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTYyMjI5MTIyNX0.s87wzlIa_a2NXxBWDR5SiohvNFAkSPmRgMkfhkk-mQg',
      USER: 'uyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2ZhYzVmM2M5ZTRjMDAxNWFhMzg4OSIsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE2MjIyOTg2NzZ9.oIM-gCDpj-tnM49WXmR68BSes-zoa65nnSivMvugE0k',
      ROOT: 'ryJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNzcxY2FlMjA0NTRjMDAxNWYzY2RhMSIsImVtYWlsIjoicGFsYXNoc2hhbnVAZ21haWwuY29tIiwiaWF0IjoxNjIyMjk4NjQzfQ.vKwYp8S43xan7wk1dkpY0Nn5uC6JGNPypcODIOF97F4'
    }
    let tableOfArticles = (
      <table className="ui celled table">
        <thead>
          {/* <tr>
            <th colSpan="5">
              <div className="ui fluid search">
                <div className="ui icon input">
                  <input
                    className="prompt"
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Search for user account"
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
          </tr> */}
          <tr>
            <th>Email</th>
            <th>emailVerified</th>
            <th>role</th>
            <th>Switch Admin/User</th>

            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {allArticles.length>0 && allArticles.map((article) => (
            <tr key={article._id}>
              <td>{article.email}</td>
              <td>{`${article.emailVerified}`}</td>
              <td>{article.role ? (article.role===ROLE.ADMIN ? 'Administrator' : 'User' ): add}</td>
              <td className="positive selectable">{article.role!=ROLE.ROOT &&
                <a onClick={() => this.handleAdminChange(article)}>
                  <i className="icon exchange"></i>
                </a>}
              </td>
              <td className="error selectable">{article.role!=ROLE.ROOT &&
                <a onClick={() => this.handleDelete(article)}>
                  <i className="icon delete"></i>
                </a>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div className="container">
        <br />
        <div className="Header">
          <h1 className="heading">Control Panel</h1>
          {this.props.isAuthenticated && (
            <Link
              to="/"
              className="Simple-Link"
              onClick={this.props.userLogoutRequest}
            >
              <i className="sign out large icon"></i>Logout
            </Link>
          )}
          {!this.props.isAuthenticated && (
            <Link to="/login" className="Simple-Link">
              <i className="sign in large icon"></i>Login
            </Link>
          )}

          {/* {this.props.isAuthenticated && showArticlesLink} */}

          <Link to="/" className="Simple-Link">
            <i className="home large icon"></i>Home
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
    allArticles: state.roles.users,
    isAuthenticated: state.users,
    
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initArticles: (page, limit) => dispatch(getAllUsers(page, limit)),
    userLogoutRequest: () => dispatch(userLogoutRequest()),
    searchArticles: (query) => dispatch(search(query)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
