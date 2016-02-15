##  PLACEHOLDER README

### Installation

```bash
npm install
npm start
```

**open browser to http://localhost:8080**

-----------

### Things to try in GraphiQL:

#### Get all user's id, name

```
{
  users {
    id
    name
  }
}
```

#### Get user with user.id of 1

```
{
  users(id: 1) {
    id
    name
  }
}
```

#### Get user and tasks with user.id of 1

```
{
  users(id: 1) {
    id
    name,
    tasks {
      id
      title
      status
    }
  }
}
```

#### Add a new user, get new user id, name

```
mutation {
  addUser(name: "New Username") {
    id
    name
  }
}
```

#### Add task for new user

```
mutation {
  addTask(title: "New task for user 3", userId: 3) {
    id
    title,
    user {
      id
      name
    }
  }
}
```

#### Get tasks and user where task.userId is 3

```
{
  tasks(userId: 3) {
    id
    title
    user {
      id
      name
    }
  }
}
```

