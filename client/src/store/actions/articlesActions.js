import * as actionTypes from './actionTypes';

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

export const getAllArticles = (page,limit) => {
    return dispatch => {
        fetch('/api/articles/?page='+page+'&limit='+limit)
        .then(res => res.json())
        .then(res => {
            localStorage.setItem('BasicMERNStackAppAllArticles', JSON.stringify(res.articles));
            dispatch({ type: actionTypes.GOT_ALL_ARTICLES, articles: res.articles })
        })
    };
};

export const getMyArticles = () => {
    return dispatch => {
        fetch('/api/articles/myarticles', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            localStorage.setItem('BasicMERNStackAppMyArticles', JSON.stringify(res.articles));
            dispatch({ type: actionTypes.GOT_MY_ARTICLES, myArticles: res.articles })
        })
    };
};

export const getArticle = (articleId) => {
    return dispatch => {
        fetch('/api/articles/' + articleId)
        .then(res => res.json())
        .then(res => {
            dispatch({ type: actionTypes.GOT_SINGLE_ARTICLE, article: res.article })
        })
    };
};

export const submitNewArticle = (articleData) => {
    return dispatch => {
        return fetch('/api/articles/add', options(articleData))
        .then(res => res.json())
    }
};

export const saveArticle = (articleId, articleData) => {
    return dispatch => {
        return fetch('/api/articles/edit/' + articleId, options(articleData))
        .then(res => res.json())
    }
}

export const checkArticleUniqueness = ({ field, value }) => {
    return dispatch => {
        return fetch('/api/articles/validate', options({ field, value }))
    }
}

export const deleteArticle = (articleId) => {
    return dispatch => {
        return fetch('/api/articles/delete/' + articleId, {
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
        return fetch(`api/articles/word?q=${query}`, {
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
