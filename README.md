# Collection
**Collection** is a web-app for collection management. It was made as a project for [Itransition](https://www.itransition.com) internship.

You can view the deployed site [here](https://collections-web.netlify.app)

* [Description](#Description)
* [Preview](#Preview)
* [Frontend stack](#Frontend-stack)
* [Backend stack](#Backend-stack)
* [Endpoints](#Endpoints)


## Description
This is a web-app for collection management.
The collection has a name, description, picture, theme, list of items. The item consists of a name, tags, custom fields, likes and comments.
When creating/editing a collection, you can define a list of fields that each item of the collection will have. The collection with all its items and fields can be exported to a CSV file.
You can add comments and likes to each item, which will be immediately displayed to other users (using Websocket).
An unauthenticated user has read-only access. Authenticated users have access to everything except the admin panel. In the admin panel, you can manage users: delete, block, assign administrators.
The administrator can delete, add, edit any collections and items on behalf of the author.
An authorized user can only manage their own collections and items. The list of the user's collections can be viewed in his profile.
On the main page, you can view the last added items, filter them by tags, and view the most popular tags. You can also see collections sorted by the number of items and filter them by theme.
You can register an account using email confirmation or using OAuth (GitHub, Google, Facebook).
Full-text site search is available on each page.
The app supports 2 languages: English and Russian, as well as two visual themes - dark and light.
The app supports 2 languages: English and Russian and two visual themes - dark and light.
## Preview
https://www.youtube.com/watch?v=e7ktvXw0kHA

[![preview](https://img.youtube.com/vi/e7ktvXw0kHA/0.jpg)](https://www.youtube.com/watch?v=e7ktvXw0kHA)

## Frontend stack
### Main stack
* react@18.2.0
* typescript
* react-router-dom@6.8.0
* reduxjs/toolkit
* axios
* socket.io-client - to display likes and comments
* meilisearch - full-text engine
* @sweet-monads/either - to convenient handling of exceptions and errors

### UI
* mui/material
  * mui/x-data-grid
  * mui/x-date-pickers
  * mui/icons-material
  * mui-image
  * notistack
* react-tagcloud
* react-instantsearch-dom

### Additional tools
* uiw/react-md-editor
* dayjs
* firebase - cloud storage and authentication by OAuth
* react-i18next
* react-hook-form


## Backend stack
* nodeJS
* typescript
* express
* sequelize (Postgres)
* socket.io - to display likes and comments
* meilisearch - full-text engine
* jsonwebtoken
* bcrypt
* @sweet-monads/either - to convenient handling of exceptions and errors

## Endpoints
**Authorisation routes**
* `POST /auth/login` - user authorization
* `POST /auth/confirm_register` - confirmation of the user's email
* `POST /auth/register` - user registration by a token after email confirmation
* `POST /auth/autologin` - automatic authorization by a token
* `POST /auth/provider` - Registration using OAuth

**Profile routes**
* `POST /profile/confirm_edit` - confirmation of the user's email when changing the profile _(for logged-in users)_
* `POST /profile/edit_by_token` - editing a profile by a token _(for logged-in users)_
* `POST /profile/edit_by_provider` - editing a profile using OAuth _(for logged-in users)_
* `PATCH /profile/edit_avatar` - editing a profile avatar _(for logged-in users)_
* `GET /profile/:userId` - get profile by id

**Admin routes (only for admins)**
* `GET /admin/users` - get all users
* `POST /admin/users/status` - changing user status (blocked| deleted | active)
* `POST /admin/users/admin_status` - adding / removing administrators

**Collection routes**
* `POST /collection` - creating a collection _(for logged-in users)_
* `PATCH /collection` - editing a collection _(for logged-in users)_
* `DELETE /collection` - deleting a collection _(for logged-in users)_
* `GET /collection/:id` - get collection by id
* `GET /collection/next` - get a range of collections (for lazy loading)
* `GET /collection/themes` - get all collection themes

**Item routes**
* `POST /item` - creating an item _(for logged-in users)_
* `PATCH /item` - editing an item _(for logged-in users)_
* `DELETE /item` - deleting an item _(for logged-in users)_
* `GET /item/:id` - get item by id
* `GET /item/next` - get a range of items (for lazy loading)
* `GET /item/tags` - get all tags
* `GET /item/popular_tags` - get the 30 most popular tags

**Dev routes (only for developers)**
* `POST /dev/meilisearch_setup` - set up the full-text engine (meilisearch)
* `POST /dev/indexing/collections` - indexing of all collections in the full-text engine
* `POST /dev/indexing/items` - indexing of all items in the full-text engine
* `POST /dev/indexing/comments` - indexing of all comments in the full-text engine

