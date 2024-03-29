import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { saveArticle } from '../../../store/actions/articlesActions';
import ErrorMsg from '../../../components/ErrorMsg/ErrorMsg';
import InputField from '../../../components/InputField/InputField';
import {toast} from 'react-toastify'
import { Link } from "react-router-dom";
import './EditArticle.css'


const FIELDS = [
    {name: 'Word', type: 'text', label: 'Word', disabled: 'disabled'},
    {name: 'Meaning', type: 'text', label: 'Meaning', disabled: 'disabled'},
    {name: 'Usage', type: 'text', label: 'Usage'    }
];

class EditArticle extends Component {
    state = {
        article: {},
        errors: {}
    };

    componentWillMount() {
        const articleId = this.props.match.params.id;
        let article, errors;
        if (localStorage.getItem('Edit' + articleId) === null ) {
            localStorage.setItem('Edit' + articleId, JSON.stringify({ article: this.props.article, errors: {} }));
            article = this.props.article;
            errors = {};
        } else {
            article = JSON.parse(localStorage.getItem('Edit' + articleId)).article;
            errors = JSON.parse(localStorage.getItem('Edit' + articleId)).errors;
        }

        this.setState(prevState => {
            return {
                ...prevState,
                article: {...article},
                errors: {...errors}
            };
        });
        document.title = "Edit word";
    }

    handleValidation = (field, value) => {
        let error = {};
        
           if (field === 'Meaning' && value === '') {
                error[field] = 'Please enter meaning';
            } else {
                error[field] = '';
            }return error;
        }
        
       

    handleInputChange = (e) => {
        const field = e.target.name;
        const value = e.target.value;

        const errors = { ...this.state.errors, ...this.handleValidation(field, value) }
        this.setState((prevState) => {
            return {
                ...prevState,
                article: {
                    ...prevState.article,
                    [field]: value
                },
                errors: {...errors}
            };
        }, () => localStorage.setItem('Edit' + this.state.article._id, JSON.stringify(this.state)));
    }

    handleEditArticleSubmit = (e) => {
        e.preventDefault();
        let errors = {...this.state.errors};
        const formValuesValid = Object.keys(errors).filter(field => errors[field] !== "").length === 0 ? true : false;
        if ( !formValuesValid ) {
            return;
        } else {
            this.props.saveArticle(this.props.match.params.id, this.state.article)
            .then(res => {
                if (res.errors) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            article: {...prevState.article},
                            errors: {...prevState.errors, ...res.errors}
                        };
                    });
                } else {
                    localStorage.removeItem('Edit' + this.props.match.params.id);
                    this.props.history.push('/articles/' + this.props.match.params.id);
                    toast.info("Saved");
                }
            })
        }
    }

    componentWillUnmount() {
        localStorage.removeItem('Edit' + this.props.match.params.id);
    }

    render() {
        
        const inputFields = FIELDS.map(field =>
            <InputField key={field.name}
                        type={field.type} name={field.name} label={field.label}
                        defaultValue={this.state.article[field.name]} disabled={field.disabled}
                        errors={this.state.errors}
                        onChange={this.handleInputChange} />
        );
        return (
            <div className="container"><br></br>
                <div className="Header">
          <h1 className="heading">Edit Word</h1>
       
        
          <Link to="/article/add" className="Simple-Link">
            <i className="plus  large icon"></i>
            <span className="item-label">Add Word</span>
          </Link>
          

          <Link to="/home" className="Simple-Link">
            <i className="home large icon"></i>
            <span className="item-label">Dashboard</span>
          </Link>
        </div> <br></br>
                <br />
                {/* <h3 className="text-center">Edit Article</h3> */}
                <div className="jumbotron">
                    <form onSubmit={this.handleEditArticleSubmit}>
                        {inputFields}
                        <div className="form-group">
                            <label>Mneomonic</label>
                            <textarea
                                name="Mneomonic" style={{height: '200px'}}
                                className="form-control"
                                onChange={this.handleInputChange}
                                defaultValue={this.state.article.Mneomonic} />
                            {this.state.errors.body !== '' && <ErrorMsg msg={this.state.errors.body} />}
                        </div>
                        <button className="btn btn-success">Save</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        article: state.articles.article
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveArticle: (articleId, articleData) => dispatch(saveArticle(articleId, articleData))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditArticle));
