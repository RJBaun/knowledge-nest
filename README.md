# Knowledge Nest

Knowledge Nest is a full stack web application built with Node and Express that provides users with a central location to save, share and interact with learning resources. 

Users can save external resoures (urls) to their 'Nest' (My Resources) and add a custom title and description, as well as a category and resource-type from a pre-determined list of options. 

Users can view, like, rate, and comment on other users' resources. Liked resources will be added to the user's 'My Resource' page for future reference.


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
6. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
7. Visit `http://localhost:8080/`

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x

## Screenshots
!["Create a new resource"](https://github.com/RJBaun/knowledge-nest/blob/master/docs/Screenshot%202024-03-15%20at%2011.26.02%E2%80%AFAM.png?raw=true)
!["Single resource page"](https://github.com/RJBaun/knowledge-nest/blob/master/docs/Screenshot%202024-03-15%20at%2011.24.54%E2%80%AFAM.png?raw=true)
!["Search results page"](https://github.com/RJBaun/knowledge-nest/blob/master/docs/Screenshot%202024-03-15%20at%2011.23.57%E2%80%AFAM.png?raw=true)
