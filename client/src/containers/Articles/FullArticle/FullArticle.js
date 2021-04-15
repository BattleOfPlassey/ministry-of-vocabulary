import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArticle, deleteArticle } from '../../../store/actions/articlesActions';
import WrappedLink from '../../../components/WrappedLink/WrappedLink';
import './FullArticle.css'

class FullArticle extends Component {
    componentDidMount() {
        this.getSingleArticle();
        
    }

    getSingleArticle() {
        if (this.props.match.params.id) {
            if (!this.props.article || (this.props.article._id !== + this.props.match.params.id)) {
                this.props.getArticle(this.props.match.params.id);
                
            }
        }
    }

    handleEditArticleClick() {
        this.props.history.replace({pathname: '/article/edit/' + this.props.match.params.id});
    }

    handleDeleteArticleClick() {
        // alert('We are deleting your article...');
        this.props.deleteArticle(this.props.match.params.id)
        .then(res => {
            if (res.success) {
                this.props.history.push('/home');
            }
        })
    }

    renderSwitch(param) {
        switch(param) {
          case 'v':
            return 'verb';
            case 'n':
            return 'noun';
            case 'adj':
            return 'adjective';
            case 'adv':
            return 'adverb';
            case 'conj':
            return 'conjunction';
            case 'inter':
            return 'interjection';
            case 'prep':
            return 'preposition';
          default:
            return '';
        }
      }

    render() {
        document.title = this.props.article.Word + " | Ministry Of Vocabulary";
        return (
            <div className="container">
                <br />
                <div className="jumbotron FullArticle">
                <div className="">
                    <h1 className="Wordheading">{this.props.article.Word}</h1>
                    <span className="TypeSpan"><i>{this.renderSwitch(this.props.article.Type)}</i></span>
                    </div>
                    <h3 className="">Definition of <i>{this.props.article.Word}</i> :</h3><p className="FullP">{this.props.article.Meaning}</p>
                    <h3 className="">Mneomonic of <i>{this.props.article.Word}</i> :</h3><p className="FullP">{this.props.article.Mneomonic ? this.props.article.Mneomonic : 'Mneomonic not available' }</p>
                    <h3 className="">Example Sentence :</h3><p className="FullP">{this.props.article.Usage ? this.props.article.Usage : 'Sentence not available'}</p>
                    
                    {/* <p>{this.props.article.Mneomonic}</p><p>{this.props.article.Usage}</p> */}
                    {this.props.isAuthenticated && this.props.authenticatedUsername === this.props.article.author
                    && <button
                        className="btn btn-danger"
                        style={{float: 'right', padding: '6px 12px'}}
                        onClick={() => this.handleDeleteArticleClick()}>Delete</button>}
                    {this.props.isAuthenticated && this.props.authenticatedUsername === this.props.article.author
                    && <WrappedLink
                        to={"/article/edit/" + this.props.match.params.id}
                        buttonClasses={['btn', 'btn-info', 'mr-2']}
                        click={() => this.handleEditArticleClick()}>Edit</WrappedLink>}
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
