# Schedule and Task management

This repository will handle CRUD for schedule and tasks

## prerequisite

- Docker
- node
- typescript
- prisma
- jest

## Setup Development

1. Install all package

```
npm install
```

2. Run docker at root project

```
docker-compose up
```

3. apply script to generate db

```
npx prisma migrate resolve --applied 20240604043439_init
```

4. run seed data

```
npx prisma db seed
```

#### Setup .env

Please change .env.example to .env

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
AUTH_SECRET='your_auth_secret'
```

#### Run local

```
npm start
```

## Testing

There is only have units at the moment for schedule and task which is coverage for 100%
run by this command

```
npm test
```

## APIs

-

### Schedule

- #### get all schedules
  - url: **GET** `/schedules?accountid=1&agentid=120&skip=0&task=3`
  - query params: `?accountid=1&agentid=120&skip=0&task=3`
    - account id (optional) is number to filter schedule data
    - agent id (optional) is number to filter schedule data
    - skip and take (optional), it support pagination
  - Response:
    ```
    [
        {
            "id": "1c823c93-2ae7-43a0-b8eb-767c56cb6d2b",
            "accountId": 1,
            "agentId": 2,
            "startTime": "2024-06-04T04:34:40.882Z",
            "endTime": "2024-06-05T04:34:40.882Z"
        },
        {
            "id": "eda58af8-bc1c-4dd5-afc3-1d284d31c3d3",
            "accountId": 2,
            "agentId": 1,
            "startTime": "2024-06-04T04:34:40.883Z",
            "endTime": "2024-06-06T04:34:40.883Z"
        }
    ]
    ```
- #### get schedule by schedule id
  - url: **GET** `/schedules/:id`
  - params: `:id`
    - id is `schedule id`
  - Response:
    ```
    {
        "id": "1c823c93-2ae7-43a0-b8eb-767c56cb6d2b",
        "accountId": 1,
        "agentId": 2,
        "startTime": "2024-06-04T04:34:40.882Z",
        "endTime": "2024-06-05T04:34:40.882Z"
    }
    ```
- #### create schedule
  - url: **POST** `/schedules`
  - body params:
    ```
    {
        "accountId": 220,
        "agentId": 102,
        "startTime": "2024-07-02 05:29:48.712",
        "endTime": "2024-07-03 05:29:48.712"
    }
    ```
  - Response:
    ```
    {
        "id": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "accountId": 1,
        "agentId": 2,
        "startTime": "2024-06-04T04:34:40.882Z",
        "endTime": "2024-06-05T04:34:40.882Z"
    }
    ```
- #### update schedule
  - url: **PATCH** `/schedules/:id`
  - params:
    - query param: `/:id`
    - body param
    ```
    {
        "accountId": 220,
        "agentId": 102,
        "startTime": "2024-07-02 05:29:48.712",
        "endTime": "2024-07-03 05:29:48.712"
    }
    ```
  - Response:
    ```
    {
        "id": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "accountId": 1,
        "agentId": 2,
        "startTime": "2024-06-04T04:34:40.882Z",
        "endTime": "2024-06-05T04:34:40.882Z"
    }
    ```
- #### delete schedule
  - url: **DELETE** `/schedules/:id`
  - query params: `/:id`
  - Response: status is 200

### Task

- #### get all tasks
  - url: **GET** `/tasks?accountid=1&scheduleid=120&skip=0&task=3`
  - query params: `?accountid=1&scheduleid=120&skip=0&task=3`
    - account id (optional) is number to filter task data
    - schedule id (optional) is number to filter task data
    - skip and take (optional), it support pagination
  - Response:
    ```
    [
        {
            "id": "4604883a-1356-4b7b-b175-ec70b72c0386",
            "accountId": 2,
            "scheduleId": "4688482b-c83f-4c26-ab5d-d13b6c35ae3e",
            "startTime": "2024-06-06T02:14:12.998Z",
            "duration": 15,
            "type": "BREAK"
        },
        {
            "id": "8e8f3677-5798-4d9d-bd70-1cb1e0495e67",
            "accountId": 1,
            "scheduleId": "64884b72-ad23-4863-a5af-2a670e6d031a",
            "startTime": "2024-06-07T02:14:12.998Z",
            "duration": 10,
            "type": "BREAK"
        }
    ]
    ```
- #### get tasks by schedule id
  - url: **GET** `/tasks/schedules/:id`
  - params: `:id`
    - id is `schedule id`
  - Response:
    ```
    [
        {
            "id": "e91df9f1-29f4-42c1-9c6f-33e2e87d1eda",
            "accountId": 220,
            "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
            "startTime": "2024-07-01T05:29:48.713Z",
            "duration": 10,
            "type": "BREAK"
        },
        {
            "id": "fd6b5bec-ba4d-4560-bdfd-3c9dfef686ad",
            "accountId": 220,
            "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
            "startTime": "2024-07-01T05:29:48.713Z",
            "duration": 10,
            "type": "BREAK"
        }
    ]
    ```
- #### get task by task id
  - url: **GET** `/task/:id`
  - params: `:id`
    - id is `task id`
  - Response:
    ```
    {
        "id": "fd6b5bec-ba4d-4560-bdfd-3c9dfef686ad",
        "accountId": 220,
        "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "startTime": "2024-07-01T05:29:48.713Z",
        "duration": 10,
        "type": "BREAK"
    }
    ```
- #### create task
  - url: **POST** `/tasks`
  - body params:
    ```
    {
        "accountId": 220,
        "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "startTime": "2024-07-01T05:29:48.713Z",
        "duration": 10,
        "type": "BREAK"
    }
    ```
  - Response:
    ```
    {
        "id": "c47ac402-0fd1-4603-9941-7d2d2e908a92",
        "accountId": 220,
        "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "startTime": "2024-07-01T05:29:48.713Z",
        "duration": 10,
        "type": "BREAK"
    }
    ```
- #### update task
  - url: **PATCH** `/tasks/:id`
  - params:
    - query param: `/:id` => `2151d50f-7107-4f6c-bc76-549b94b9edc5`
    - body param
    ```
    {
        "accountId": 110,
        "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "startTime": "2024-07-01T05:29:48.713Z",
        "duration": 10,
        "type": "WORK"
    }
    ```
  - Response:
    ```
    {
        "id": "2151d50f-7107-4f6c-bc76-549b94b9edc5",
        "accountId": 110,
        "scheduleId": "c5d28d36-6403-444b-9fd8-962cd36711ac",
        "startTime": "2024-07-01T05:29:48.713Z",
        "duration": 10,
        "type": "WORK"
    }
    ```
- #### delete single task

  - url: **DELETE** `/task/:id`
  - query params: `/:id`
  - Response: status is 200

- #### delete bulk task
  - url: **DELETE** `/task/`
  - params:
    ```
        {
            "taskIds": ["443a6376-0fea-4bd1-8293-890533a9be13", "32323", "5ea15a01-1b3a-4531-8984-f95c441faa46"]
        }
    ```
  - Response:
    ```
    {
        "deletedTaskIds": [
            "443a6376-0fea-4bd1-8293-890533a9be13",
            "5ea15a01-1b3a-4531-8984-f95c441faa46"
        ]
    }
    ```
