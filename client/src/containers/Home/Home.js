import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllArticles, getMyArticles, search } from '../../store/actions/articlesActions';
import Article from '../../components/Article/Article';
import WrappedLink from '../../components/WrappedLink/WrappedLink';
import { userLogoutRequest } from '../../store/actions/usersActions';
import './Home.css';
import Client from "../../ClientMongo";

const MATCHING_ITEM_LIMIT = 25;
class Home extends Component {
    state = {
        showMyArticles: false,
        page:1,
        limit:10,
        
        showRemoveIcon: false,
       
        loading : false
    }

    handleSearchChange = e => {
        this.setState({loading:true});
        const value = e.target.value;
    
            
        if (value === "") {
          this.setState({
            
            showRemoveIcon: false,
            loading:false
          });
        } else {
          this.setState({
            showRemoveIcon: true
          });
    
        //   Client.search(value, foods => {
        //     this.setState({
        //       foods: foods.slice(0, MATCHING_ITEM_LIMIT)
        //     });
        //     this.setState({loading:false});
        //   });
        this.props.searchArticles(value);

        }
      };
    
      handleSearchCancel = () => {
        this.setState({
          
          showRemoveIcon: false,
          
        });
      };

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
        const { showRemoveIcon, foods } = this.state;
    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };
        let allArticles = this.props.allArticles || JSON.parse(localStorage.getItem('BasicMERNStackAppAllArticles'));
        // allArticles = allArticles.map(article => (
        //     <Article
        //         key={article._id}
        //         id={article._id}
        //         title={article.Word} meaning={article.Meaning} />
        // ));
        const add = '-'
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
                          style={{width: "100%"}}
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
                  <td>{(article.Mneomonic) ? article.Mneomonic : add }</td>
                  <td>{(article.Usage) ? article.Usage : add }</td>
                  <td>
                  {this.props.isAuthenticated 
                    && <WrappedLink
                    to={'/articles/' + article._id}
                    buttonClasses={['btn', 'btn-info', 'ViewButton',]}><i className="pencil icon"></i></WrappedLink>
                        }
                    
                    
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )

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
                            {/* { this.state.showMyArticles ? myArticles : allArticles } */}
                            {tableOfArticles}
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
        userLogoutRequest: () => dispatch(userLogoutRequest()),
        searchArticles: (query)=> dispatch(search(query))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


/* 
import Client from "./Client";



  handleSearchChange = e => {
    this.setState({loading:true});
    const value = e.target.value;

    this.setState({
      searchValue: value
    });

    if (value === "") {
      this.setState({
        foods: [],
        showRemoveIcon: false,
        loading:false
      });
    } else {
      this.setState({
        showRemoveIcon: true
      });

      Client.search(value, foods => {
        this.setState({
          foods: foods.slice(0, MATCHING_ITEM_LIMIT)
        });
        this.setState({loading:false});
      });
    }
  };

  handleSearchCancel = () => {
    this.setState({
      foods: [],
      showRemoveIcon: false,
      searchValue: ""
    });
  };

  render() {
    const { showRemoveIcon, foods } = this.state;
    const removeIconStyle = showRemoveIcon ? {} : { visibility: "hidden" };

    const foodRows = foods.map((food, idx) => (
      <tr key={idx} onClick={() => this.props.onFoodClick(food)}>
        <td>{food.Word}</td>
        <td>{food.Meaning}</td>
        <td>{food.Mneomonic}</td>
        <td>{food.Usage}</td>
        
        </tr>
        ));
    
        return (
          <div id="food-search">
            <table className="ui selectable unstackable table celled large orange">
              <thead>
                <tr>
                  <th colSpan="4">
                    <div className="ui fluid search">
                      <div className="ui icon input">
                        <input
                          className="prompt"
                          type="text"
                          style={{width: "100%"}}
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
                  <th className="">Meaning</th>
                  <th className="">Mnemonic</th>
                  <th className="">Usage</th>
                  
                </tr>
              </thead>
              <tbody>
                
                {foodRows}
              </tbody>
            </table>
            {this.state.loading && <div className="ui active centered inline loader"></div>}
          </div>
        );
      }
    }
    
    export default FoodSearch;
     */