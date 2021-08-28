# Server

## Models
- User
- Recipe

### User
- username - string
- password - string

### Recipe
- category - string
- name - string
- directions - string
- cookTime - number
- servings - number
- public - boolean
- photoURL - string
- views - number

## usercontroller

### POST
- user/register
- user/login

## recipecontroller

### POST
- recipe/create/

### PUT
- recipe/update/:id

### GET
- recipe/
- recipe/:user_id

### DELETE
- recipe/:id