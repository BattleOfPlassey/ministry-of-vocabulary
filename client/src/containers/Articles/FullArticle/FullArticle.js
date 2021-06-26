import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArticle, deleteArticle } from '../../../store/actions/articlesActions';
import WrappedLink from '../../../components/WrappedLink/WrappedLink';
import './FullArticle.css'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

class FullArticle extends Component {
  componentDidMount() {
    this.getSingleArticle();
  }

  getSingleArticle() {
    if (this.props.match.params.id) {
      if (
        !this.props.article ||
        this.props.article._id !== +this.props.match.params.id
      ) {
        this.props.getArticle(this.props.match.params.id);
      }
    }
  }

  handleEditArticleClick() {
    this.props.history.replace({
      pathname: "/article/edit/" + this.props.match.params.id,
    });
  }

  handleDeleteArticleClick() {
    // alert('We are deleting your article...');
    this.props
      .deleteArticle(this.props.match.params.id)
      .then(response =>{
        // console.log(response)
        if (response.success !== "success") {
          //   console.log(response);
          toast.error("You are not authorised to delete. Contact Administrator!");
        } else this.props.history.push("/home");

          // toast.info("Delete Success");
      });
      

    //   .then((res) => {
    //     console.log(res);
    //     if (res.success) {
    //       this.props.history.push("/home");
    //     }
    //   });
  }

  renderSwitch(param) {
    switch (param) {
      case "v":
        return "verb";
      case "n":
        return "noun";
      case "adj":
        return "adjective";
      case "adv":
        return "adverb";
      case "conj":
        return "conjunction";
      case "inter":
        return "interjection";
      case "prep":
        return "preposition";
      default:
        return "";
    }
  }

  render() {
    document.title = this.props.article.Word + " | Vocab.js.org";
    return (
      <div className="container">
        <br />
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
        <div className="Header">
          <h1 className="heading">Flash Card</h1>
       
          {!this.props.isAuthenticated && (
            <Link to="/login" className="Simple-Link">
              <i className="sign in large icon"></i>
              <span className="item-label">Login</span>
            </Link>
          )}
          <Link to="/article/add" className="Simple-Link">
            <i className="plus  large icon"></i>
            <span className="item-label">Add Article</span>
          </Link>
          {/* {this.props.isAuthenticated && showArticlesLink} */}

          <Link to="/home" className="Simple-Link">
            <i className="home large icon"></i>
            <span className="item-label">Dashboard</span>
          </Link>
        </div> <br></br>
        <div className="jumbotron FullArticle">
          <div className="">
            <h1 className="Wordheading">{this.props.article.Word}</h1>
            <span className="TypeSpan">
              <i>{this.renderSwitch(this.props.article.Type)}</i>
            </span>
          </div>
          <h3 className="">
            Definition of <i>{this.props.article.Word}</i> :
          </h3>
          <p className="FullP">{this.props.article.Meaning}</p>
          <h3 className="">
            Mneomonic of <i>{this.props.article.Word}</i> :
          </h3>
          <p className="FullP">
            {this.props.article.Mneomonic
              ? this.props.article.Mneomonic
              : "Mneomonic not available"}
          </p>
          <h3 className="">Example Sentence :</h3>
          <p className="FullP">
            {this.props.article.Usage
              ? this.props.article.Usage
              : "Sentence not available"}
          </p>

          {/* <p>{this.props.article.Mneomonic}</p><p>{this.props.article.Usage}</p> */}
          {this.props.isAuthenticated &&
            this.props.authenticatedUsername === this.props.article.author && (
              <button
                className="btn btn-danger"
                style={{ float: "right", padding: "6px 12px" }}
                onClick={() => this.handleDeleteArticleClick()}
              >
                Delete
              </button>
            )}
          {this.props.isAuthenticated &&
            this.props.authenticatedUsername === this.props.article.author && (
              <WrappedLink
                to={"/article/edit/" + this.props.match.params.id}
                buttonClasses={["btn", "btn-info", "mr-2"]}
                click={() => this.handleEditArticleClick()}
              >
                Edit
              </WrappedLink>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        article: state.articles.article,
        isAuthenticated: state.users.isAuthenticated,
        authenticatedUsername: state.users.authenticatedUsername
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getArticle: (articleId) => dispatch(getArticle(articleId)),
        deleteArticle: (articleId) => dispatch(deleteArticle(articleId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FullArticle);
