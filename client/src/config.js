//For GitHub Pages deployment
// export const HOST = 'https://ministry-of-vocabulary.herokuapp.com';

// For Local Server & Production deployment
export const HOST = (process.env.env=='production') ? 'https://ministry-of-vocabulary.herokuapp.com' : ''; 