# Intervid-Front

# from v1 repo:
# Intervid - Frontend


## Project directory structure <a id="directory-structure"></a>

```
.
+-- assets          // scss, images, icons, audio etc.
+-- cmps      // internal components (anything other than page component), split to page
|   +-- common // common components used throughout the whole project
|   +-- interview-app // components used in the interview-app page
|   +-- review-app // components used in the review-app page and so on...
|   +--...
+-- mixins         // Common reusable mixins
+-- views         // page components
+-- services     // REST API, storage, entity services, etc.
+-- store        // Vuex modules
+-- App.vue
+-- main.js      // Entry point for the whole app
+-- router.js    // Routes and router middleware
```
---
## Entities in project

### user - User
```javascript
{
    "_id" : "",
    "email" : "",
    "password" : "",
    "logoUrl" : "", // Url for user image/logo, currently stored in cloudinary
    "role" : "user",
    "createdAt" : "",
    "lastLogin" : "", 
    "fName" : "", // first name
    "lName" : "" // last name
}
```
Mini User:
```javascript
{
    "_id" : "",
    "email" : "",
    "logoUrl" : "", // Url for user image/logo, currently stored in cloudinary
    "fName" : "", // first name
    "lName" : "" // last name
}
```
### inter - Interview
There are two types of interviews,
1. Named interview - gets created and stored as as soon as the owner creates it (he can choose to send a link to canidates email or not).
2. Public interview - is stored as an [interview template](#intertemp) and the url provided holds data about the candidate, jobTitle and the chosen interview template

```javascript
{
  "_id": "",
  "owner": "miniUser", // The user that sent the interview
  "timeline": {
      "sentAt": "", // Interview was sent to candidate
      "openedAt": "", // Candidate opened the interview
      "submittedAt": "", // Candidate finished and submitted the interview
      "quitedAt": "" // Candidate quited mid interview
  },
  "cand":{ // This is not an entity, it looks like a user but it is not stored in user collection. in the future it should be.
     "email" : "",
      "id" : "",
      "role" : "cand", // This differentiates a user from a candidate
      "imgUrl" : "",
      "fName" : "",
      "lName" : ""
  },
  "quests": [ // Array of the interview questions
    {
      "id":"",
      "txt":"", // The title of the question (if its a short question, this is the whole question)
      "desc":"", // Optionally we can have a long description, this is rich text (html)
      "vidUrl":"", // Cuurently not supported, option the have a video on the question itself
      "opts":"", // If this is a multiple choice question, currently not supported
      "ansRule": { // What type of answer this question needs. (Video, Text, Image, Screen Recording)
        "isVidAns" : true, 
        "isTxtAns" : false,
        "isImgAns" : false, // Currently not supported
        "isScreenAns" : true
      },
      "rule": { // Whats the maximum time for the answer and maximum retries (currently not supported)
        "timeLimit" : 4, // in minutes
        "maxTryNum" : 1
      }
    }
  ], 
  "answerMap": { // The answers for the question in a form of a map answerMap[questId] = answer
      "questId": {
          "faceKey": "", // The AWS Bucket key for the candidates camera video
          "screenKey": "", // The AWS Bucket key for the candidates screen video
          "imgUrl": "", // Url for image used to answer the question, currently not supported
          "takeNum": 0, // Number of tries it took candidate to answer, currently not supported
          "resTime": 0, // Time it took for candidate to answer the question
          "txt": "" // If its a text question, this holds the candidates text answer
      }
  }
}
```
## review - Interview review
This entity holds the review a specific user gave to an interview.  
The reason why this entity is not a part of the interview is because we can have the same interview in more than one account / user.

For example, in a single account (e.g Natural Intelligence)  
A candidate can be interviewing to different positions, one in Frontend department and another in DevOps department.  
The frontend department can give a different review for the same interview as the devops department.  
Another example is when MisterBit conducts an internal interview and then wants to send to it another company,  
we create a new review object that holds the same "interviewId".

```javascript
{
    "_id": "",
    "interviewId": "", // The interview the review is talking about
    "owner": "miniUser", // The user that gave the review
    "jobTitle": "", // The name of the job the interview was
    "noteMap": { // Each video question can have some parts of it bookmarked, you can save a specific timespan inside the video and play only those parts
        "questId": {
          "startTime": "TS", 
          "endTime": "TS",
          "id": "",
          "desc":"" // Text for the bookmark
          "creator": "miniUser",
        }
    },
    "status": { // The evaluation and recruitment status of the interview.
        "eval": { // Evaluation status see "evalStatusMap" below
            "code": 1, // This code maps to a label and a color
            "date": "TS" // Date the status was given
        },
        "rec": { // Recruitment status see "recStatusMap" below
            "code": 1,
            "date": "TS"
        }
    },
    "comments": [ // Comments given by different users to the whole interview
      {
        "createdBy": "miniUser",
        "createdAt": "TS",
        "txt": ""
      }
    ],
    "archivedAt": "TS", // When a user archived a review
    "isStarred": true, // If user marks this review as a favorite in dashboard (star)
}
```

Mapping between a status code to meaning:

```javascript
const evalStatusMap = {
  0: { label: 'New', color: '#c4c4c4' },
  1: { label: 'Maybe later', color: '#ed9928' },
  2: { label: 'Hire', color: '#2b76e5' },
  3: { label: 'Not Relevant', color: '#e2445c' },
  4: { label: 'Short List', color: '#00c875' },
}
const recStatusMap = {
  0: { label: 'N / A', color: '#c4c4c4' },
  1: { label: 'Offer Sent', color: '#00c875' },
  2: { label: 'Signed', color: '#2b76e5' },
  3: { label: 'Not Interested', color: '#ed9928' },
}
```
## interTemp - Interview Template <a id="intertemp"></a>
Entity that holds only questions, this is used to manage different templates for interviews.  
The user can save and add templates for later use,
when user sends an interview using a template we take all the quests array and insert them into a new inter object.
```javascript
{
    "_id": "",
    "quests": [ 
       "questObj"
    ],
    "createdAt": "",
    "name": "",
    "createdBy": "miniUser Obj"
}
```
---
## activity - An User action or activity
The account admin can see activities being done by users under the same account.  
The root admin (us) can see all activities in all account.  
```javascript
{
  "_id": "",
  "date": "TS",
  "user": "miniUser",
  "type": "CRUD", // any crud action, in addition to: "watch", "login", "logout"
  "target": "target entity", // The target of the activity (user, interview)
  "desc": "", // A different description for different activities
  "meta": {} // Info that relates to the specific activity (e.g interviewId, questId,)
}
```
## record - Log records
Almost every user interaction generates a log, either in the frontend and in the backend of the app.  
Logs from the frontend are sent to backend and stored in a collection.

```javascript
{
    "_id": "",
    "timestamp": "2021-02-16T10:14:40.813Z", // name need to be changed to Date.
    "level": "", // Log level (HTTP, ERROR, INFO, WARN, DEBUG)
    "message": "", // The message sent with the log
    "meta": { // Any information that can be usefull when seeing this record
        "enviroment": "", // Prodution development or staging
        "source": "", // Where the log came from (frontend / backend)
        "traceID": "c3fe2816-a64b-4f6e-bfd3-d4b3c41c7d7b", // an ID given to each request to the server, used to follow a request from the moment 
        // ... and more                                       it reaches the server to the moment it returns to the frontend
    }
}
```
## App Flows

### Authentication Flow
Intervid uses [JWT](https://jwt.io/) to authenticate its users and candidates.  
This is the flow we used:  
#### User Auth-
![User Authentication Flow](https://github.com/intervid-ca/intervid-front/blob/master/md-assets/user-auth-flow.png?raw=true)
#### Candidate Auth-
![Candidate Authentication Flow](https://github.com/intervid-ca/intervid-front/blob/master/md-assets/cand-auth-flow.png?raw=true)

### Candidate Interview
1. Onboarding - We verify the candidate and check inputs are working fine (camera, screen share, microphone)
2. Interview - Candidates answers questions, when the candidate finishes to answer a question we upload it to AWS S3.
3. Interview end - progress bar showing upload status.

### Video Upload Flow
As soon as the candidate answers a question we start uploading the videos (face and screen) to AWS S3.  
The upload is handled by a library called "Uppy", it uses a [multipart upload protocol](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) which means the files are being uploaded in small chunks.  
For every chunk a request is sent to our backend which responds with an [presigned upload url](https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/) specific to that chunk.  
If a chunk fails to upload for any reason we have a retry mechanism at work which will retry untill success.  
When the file finish to upload we save the [file key](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html) in the right answer object.  
The process is still not done, for the file to be streamable we need to do something called [video transcoding](https://medium.com/videocoin/what-is-video-transcoding-and-why-do-you-do-it-348a2610cefc).  
To achieve this we use an AWS service called [Elemental MediaConvert](https://aws.amazon.com/mediaconvert/).  
As soon as a video finishes uploading, our backend triggers this service which start to do the media conversion,  
this process can take some time, but the video is already watchable although it will have long buffering times.

### Video Stream Flow
When a user wants to watch an interview, we send a GET request to the backend endpoint /api/inter/:id with a query param "isWatcher".  
We do this so the server knows to convert the video file key to a watchable URL, again we need a presigned url for this.  
As stated above in [Video Upload Flow](#video-upload-flow) we do a conversion process for every video file,  
so for every video we will have multiple files in different formats.  
Our server will always try to give the best format (mp4 for now), but if this isnt available (because the transcoding proccess has'nt finished yet)  
it will serve the raw video file which will cause the video to have long buffering times.

## Services & Libraries used

### faceapi.js - Facial recognition for taking the candidate's image
This library knows how to take a video camera stream and recognise faces from it.  
When the cadidate is in the onboarding step we take a picture, crop it and save it so we can have candidate images in the dashboard.  
If we fail to find a face (blurry cammera or image not centered enough) we just give up (after 10 seconds).  
See code in [faceService.js](../master/src/services/faceService.js)

### HotJar - A UX analizer service.
We use this service to understand how users behave in our app. 
Every click a user does, time spent in different pages, user information and much more.  
We use a library called vue-hotjar which sends this information to the service.  
The code that does this can be found in [main.js](../master/src/main.js)  
[Hotjar](https://www.hotjar.com/)

### Google Analitycs - Event and user session analitycs
The app uses google analitycs to collect information about user sessions and different events that happen through a session.  
The code that does this can be found in [main.js](../master/src/main.js)  


---

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

------------End of v1 docs-----------

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
