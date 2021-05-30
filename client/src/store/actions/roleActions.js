import * as actionTypes from './actionTypes';
import * as env from '../../config';


const options = (data) => {
    return {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(data)
    };
};

export const getAllUsers = (page,limit) => {
    return dispatch => {
        fetch(`${env.HOST}/api/root/?page=`+page+`&limit=`+limit, 
        {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
            'Content-Type': 'application/json'
        }}
        )
        .then(res => res.json())
        .then(res => {
            localStorage.setItem('AllUsers', JSON.stringify(res.articles));
            dispatch({ type: actionTypes.GOT_ALL_USERS, articles: res.articles })
        })
    };
};







export const deleteArticle = (articleId) => {
    return dispatch => {
        return fetch(`${env.HOST}/api/articles/delete/` + articleId, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
                'Content-Type': 'application/json'
            },
            method: 'delete'
        })
        .then(res => res.json())
    };
}

export const search = (query) => {
    return dispatch => {
        return fetch(`${env.HOST}/api/articles/word?q=${query}`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
              'Content-Type': 'application/json'
          },
            accept: "application/json"
          })
            .then(checkStatus)
            .then(parseJSON)
      .then(res => {
        localStorage.setItem('BasicMERNStackAppAllArticles', JSON.stringify(res.articles));
        dispatch({ type: actionTypes.GOT_ALL_ARTICLES, articles: res.articles })
    })
  }}
  
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
  
  function parseJSON(response) {
    return response.json();
  }
