# 

ICUC law-firm-backend
====================

## Using Node.js, MongoDB, jest And Docker

### Features:
- [x] Add a new client to the database.
- [x] Retrieve an existing client from the database.
- [x] Update an existing client in the database.
- [x] Remove a client from the database.

### Jest testing user stories:
1) Registering a new admin who can add a client.
2) Logging in a new admin.
3) Refreshing a logged-in jwt.
4) Adding a new client.
5) Retrieving all clients.
6) Retrieving one client.
7) Updating a client.
8) Adding a note to a client.
9) Deleting a client.
10) Revoking a logged-in jwt.

#### Running it locally
```
git clone https://github.com/Liopun/icuc-law-backend.git
cd icuc-law-backend/
docker build -t icuc-law-backend .
docker run -it -p 3001:3000 icuc-law-backend  
```

#### Running it from DockerHub
```
docker pull liopun/icuc-law-backend
docker run -it -p 3001:3000 liopun/icuc-law-backend
```