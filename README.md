# Server 

## Models
---

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

## Controllers

### usercontroller
---

The usercontroller handles requests from the client related to the creation and signing in of users.

#### user/register
An endpoint for the client to attempt creation of a new user.  If creation is sucessful a sessionToken will be provided in the response.

##### Status Codes:
    200: success
    409: conflict, email or username taken
    500: internal error

##### POST
```js
//  REQUEST
body: {
    user: {
        email: string,
        username: string,
        password: string
    }
}
//  RESPONSE
json: {
    message: string, 
    emailMessage: string,
    usernameMessage: string,
    sessionToken: string,
    error: object
}   
```

#### user/login
Handles requests for logging in an existing user.  If login is sucessful a sessionToken is provided in the response.

##### Status Codes:
    200: success
    409: incorrect password or email not registered
    500: internal error

##### POST
```js
    //  REQUEST
    body: {
        user: {
            email: string,
            password: string
        }
    }
    //  RESPONSE
    json: {
        message:
    }
```
### recipecontroller
---

Handles Create, Read, Update, and Delete requests related to Recipes

#### recipe/create
Handles creation of new recipes
##### Status Codes: 
```
500: internal error
```
##### POST
```js
    //  REQUEST
    body: {
        recipe: {
            category: string, 
            name: string,
            directions: string,
            cookTime: number,
            servings: number,
            isPublic: boolean, // optional
            photoURL: string // optional
        }
    }


    //  RESPONSE
    json: {
        message: string,
        recipe: object,
        recipes: array,
        error: object

    }
```
#### recipe/:id

**THIS ENDPOINT HAS NOT BEEN IMPLEMENTED YET**

Handles requests related to a single recipe.

##### Status Codes: 

```
500: internal error
```

##### PUT

**NOT IMPLEMENTED**

Allows user to update a recipe if they are the one who created it.  This is protected.

```js
    //  REQUEST
    headers: {
        authorization: string, //sessionToken provided with request
    }
    body: {
        recipe: {
            category: string,   //optional 
            name: string,       //optional
            directions: string, //optional
            cookTime: number,   //optional
            servings: number,   //optional
            isPublic: boolean,  //optional
            photoURL: string    //optional
        }
    }
    //  RESPONSE
    json: {
        message: string,
        recipe: object,
        error: object
    }
```

##### GET

Allows client to access a single recipe. If a token if provided with the request and that user has not viewed the recipe previously then the recipes views will increment

**NOT IMPLEMENTED**

```js
    //  REQUEST
    headers: {
        authorization: string, //(optional) sessionToken provided with request
    }
    //  RESPONSE
    json: {
        message: string,
        recipe: object,
        error: object
    }
```

##### DELETE

Allows user to delete a recipe if they are the one who created it.  This is protected.

```js
    //  REQUEST
    headers: {
        authorization: string, //sessionToken provided with request
    }
    //  RESPONSE
    json: {
        message: string,
        recipe: object,
        error: object
    }
```

#### recipe/mine

Returns all recipes that belong to the requests user.

##### Status Codes: 

```js
500: internal error
    // TODO
```

##### GET


#### recipe/category/:category

Returns recipes with the matching category

##### Status Codes: 

```js
500: internal error
    // TODO
```

##### GET
    **TODO**