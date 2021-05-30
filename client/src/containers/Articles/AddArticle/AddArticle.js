import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { submitNewArticle } from '../../../store/actions/articlesActions';
import ErrorMsg from '../../../components/ErrorMsg/ErrorMsg';
import InputField from '../../../components/InputField/InputField';
import { checkArticleUniqueness } from '../../../store/actions/articlesActions'
import { Link } from "react-router-dom";


const FIELDS = [
    {name: 'Word', type: 'text', label: 'Word'},
    {name: 'Meaning', type: 'text', label: 'Meaning'},
    {name: 'Usage', type: 'text', label: 'Usage'    }
];

class AddArticle extends Component {
    state = {
        article: {},
        errors: {}
    };

    componentWillMount() {
        document.title = "Add Article | Ministry Of Vocabulary";
        if (localStorage.getItem('AddArticlePage') !== null ) {
            const { article, errors } = JSON.parse(localStorage.getItem('AddArticlePage'));
            this.setState(prevState => {
                return {
                    ...prevState,
                    article: {...article},
                    errors: {...errors}
                };
            });
        }
    }

    handleValidation = (field, value) => {
        let error = {};
        if (field === 'Word' && value === '') {
            error[field] = 'This field is required';
        } else if (field === 'Meaning' && value === '') {
            error[field] = 'This field is required';
        } else {
            error[field] = '';
        }
        return error;
    }

    ArticleUniqueness = async ({ field, value }) => {
        const uniquenessError = await this.props.checkArticleUniqueness({ field, value })
            .then(res => res.json())
            .then(res => {
                let result = {};
                if (res.error) {
                    result = res.error;
                } else {
                    result[field] = '';
                }
                return result;
            });
        return uniquenessError;
    }

    handleInputChange = async (e) => {
        const field = e.target.name;
        const value = e.target.value;

        let errors = { ...this.state.errors, ...this.handleValidation(field, value) }
        const commonValidationError = await this.handleValidation(field, value);
        
        let uniquenessError = {};
        if (( field === 'Word') && value !== '') {
            uniquenessError = await this.ArticleUniqueness({ field, value });
            errors = { ...errors, [field]: commonValidationError[field] || uniquenessError[field] };
        } else {
            errors = { ...errors, ...commonValidationError };
        }


        this.setState((prevState) => {
            return {
                ...prevState,
                article: {
                    ...prevState.article,
                    [field]: value
                },
                errors: {...errors}
            };
        }, () => localStorage.setItem('AddArticlePage', JSON.stringify(this.state)));
    }

    componentWillUnmount() {
        localStorage.removeItem('AddArticlePage');
    }

    handleNewArticleSubmit = (e) => {
        e.preventDefault();
        let errors = {...this.state.errors};
        const formValuesValid = Object.keys(errors).filter(field => errors[field] !== "").length === 0 ? true : false;
        if ( !formValuesValid ) {
            return;
        } else {
            this.props.submitNewArticle({...this.state.article, author: this.props.authenticatedEmail})
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
                    this.props.history.push('/home');
                }
            })
        }
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="container">
                <br />
                <div className="Header">
          <h1 className="heading">Add Word</h1>
       
        
         
          

          <Link to="/home" className="Simple-Link">
            <i className="home large icon"></i>
            <span className="item-label">Dashboard</span>
          </Link>
        </div><br></br>
                {/* <h3 className="text-center">Add Article</h3> */}
                <div className="jumbotron">
                    <form onSubmit={this.handleNewArticleSubmit}>
                        <InputField key={FIELDS[0].name}
                            type={FIELDS[0].type} name={FIELDS[0].name} label={FIELDS[0].label}
                            
                            errors={this.state.errors}
                            onChange={this.handleInputChange} />
                            
                        <InputField key={FIELDS[1].name}
                            type={FIELDS[1].type} name={FIELDS[1].name} label={FIELDS[1].label}
                            disabled={FIELDS[1].disabled}
                            errors={this.state.errors}
                            onChange={this.handleInputChange} />
                            <InputField key={FIELDS[2].name}
                            type={FIELDS[2].type} name={FIELDS[2].name} label={FIELDS[2].label}
                            
                            errors={this.state.errors}
                            onChange={this.handleInputChange} />
                        <div className="form-group">
                            <label>Mneomonic</label>
                            <textarea
                                name="Mneomonic" style={{height: '200px'}}
                                className="form-control" placeholder="Enter Mneomonic"
                                onChange={this.handleInputChange}
                                defaultValue={this.state.article.Mneomonic} />
                            {this.state.errors.body !== '' && <ErrorMsg msg={this.state.errors.body} />}
                        </div>
                        <button className="btn btn-success">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.users.isAuthenticated,
        authenticatedUsername: state.users.authenticatedUsername
    };
}

const mapDispatchToProps = dispatch => {
    return {
        submitNewArticle: (articleData) => dispatch(submitNewArticle(articleData)),
        checkArticleUniqueness: (userInputDetails) => dispatch(checkArticleUniqueness(userInputDetails)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArticle);
