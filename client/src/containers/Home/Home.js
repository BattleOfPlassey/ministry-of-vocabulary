import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllArticles, getMyArticles } from '../../store/actions/articlesActions';
import Article from '../../components/Article/Article';
import WrappedLink from '../../components/WrappedLink/WrappedLink';
import { userLogoutRequest } from '../../store/actions/usersActions';
import './Home.css';

class Home extends Component {
    state = {
        showMyArticles: false,
        page:1,
        limit:10
    }

    componentWillMount() {
        if (this.props.location.pathname === '/article/myarticles' && !this.state.showMyArticles) {
            this.toggleShowMyArticles();
        }
    }

    componentDidMount() {
        this.props.initArticles(this.state.page,this.state.limit);
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
                showMyArticles: !prevState.showMyArticles
            }
        });
    }

    render() {
        let allArticles = this.props.allArticles || JSON.parse(localStorage.getItem('BasicMERNStackAppAllArticles'));
        allArticles = allArticles.map(article => (
            <Article
                key={article._id}
                id={article._id}
                title={article.Word} meaning={article.Meaning} />
        ));
        // const add = '(Add yours)'
        // let tableOfArticles = (
        //   <table className="ui celled table">
        //     <thead>
        //       <tr>
        //         <th>Word</th>
        //         <th>Meaning</th>
        //         <th>Mneomonic</th>
        //         <th>Usage</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {allArticles.map((article) => (
        //         <tr>
        //           <td>{article.Word}</td>
        //           <td className="selectable negative"><a href="#"><i className="pencil icon"></i>{article.Meaning}</a></td>
        //           <td className="selectable positive">
        //             <a href="#"><i className="pencil icon"></i>{(article.Mneomonic) ? article.Mneomonic : add }</a>
        //           </td>
        //           <td className="selectable warning">
        //           {this.props.isAuthenticated 
        //             && <WrappedLink
        //                 to={"/article/edit/" + article._id}
        //                 buttonClasses={['btn']}
        //                 click={() => this.handleEditArticleClick(article._id)}>Edit</WrappedLink>}
                    
                    
        //             {/* <a><i className="pencil icon"></i>{(article.Usage) ? article.Usage : add }
                    
                    
                    
                    
        //             </a> */}
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // )

        let myArticles = [];
        if (this.props.isAuthenticated && this.state.showMyArticles) {
            if (this.props.myArticles) {
                myArticles = [...this.props.myArticles];
            } else {
                myArticles = [...JSON.parse(localStorage.getItem('BasicMERNStackAppMyArticles'))]
            }
            myArticles = myArticles.map(article => (
                <Article
                    key={article._id}
                    id={article._id}
                    title={article.title} />
            ));
        }

        const showArticlesLink = <WrappedLink
                to={this.state.showMyArticles ? "/" : "/article/myarticles"}
                buttonClasses={['btn', 'btn-outline-info', 'mr-3', 'MyArticlesButton']}
                onClick={this.toggleShowMyArticles}>
                    { this.state.showMyArticles ? 'All Articles' : 'My Articles' }
                </WrappedLink>

        return (
            <div className="container">
                <br />
                <div className="Header">
                    <h1 style={{display: 'inline-block'}}>All Articles</h1>
                    <WrappedLink to="/article/add" buttonClasses={['btn', 'btn-primary', 'mr-3', 'AddArticleButton']}>Add Article</WrappedLink>
                    {this.props.isAuthenticated && showArticlesLink}
                    {!this.props.isAuthenticated && <WrappedLink to="/login" buttonClasses={['btn', 'btn-primary', 'mr-3', 'AddArticleButton']}>Login</WrappedLink>}
                    {this.props.isAuthenticated && <WrappedLink to='/' onClick={this.props.userLogoutRequest} buttonClasses={['btn', 'btn-primary', 'mr-3']}><i className="sign out large icon"></i>Logout</WrappedLink>}
                    
                </div>
                <br />
                <div>
                    <section className="jumbotron">
                        <div className="Articles">
                            { this.state.showMyArticles ? myArticles : allArticles }
                            {/* {tableOfArticles} */}
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allArticles: state.articles.articles,
        myArticles: state.articles.myArticles,
        isAuthenticated: state.users.isAuthenticated
    };
};

const mapDispatchToProps = dispatch => {
    return {
        initArticles: (page,limit) => dispatch(getAllArticles(page,limit)),
        getMyArticles: () => dispatch(getMyArticles()),
        userLogoutRequest: () => dispatch(userLogoutRequest())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
