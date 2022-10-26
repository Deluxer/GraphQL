<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="#" target="blank"><img src="https://graphql.org/img/logo.svg" width="200" alt="GraphQL Logo" /></a>
</p>


## Create users en register items with GraphQL

Implement GraphQL with Nestjs to register users using ApolloGraph and security conexion with JWT

Requirements
- Node 18
- Postgres
- Docker

# Dev

1. Clone repo
2. Copy ```.env.example``` and rename ```.env```
3. Install
```
yarn install
```
4. Run Docker image
```
docker-compose up -d
```
5. Start
```
yarn start:dev
```
6. See  Apollo GraphQL
```
  http://localhost:3000/graphql
```
7. Execute __Mutation__ executeSeed to populate database.