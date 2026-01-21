# Feedback Summary App
### Intro
The app was created as a pet project with several goals:
- to develop my a functioning app
- to learn new technologies
- to add something to my porfolio
- to exercise my brain muscle

### Project description
The application will be used for submitting and analyzing feedback. The specific usecase involves students as those giving feedback, and teachers receiving feedback. Feedback can be submitted at specified sessions (e.g. summer semester evaluation).

There will be 3 kinds of users each having different roles and rights:
- *student* - select feedback session, give feedback to relevant teachers (teachers, whose course the teacher is enrolled in), update given feedback
- *teacher* - receive feedback, filter out only relevant feedback (currently based on course and session)
- *admin* - create feedback session (name, questions, question types, start and end date)

Preliminary project structure involves
- *frontend* - provide login interface, identify user type, relay to the proper UI version
- *backend* - APIs to access the database, perform authentication
- *database* - Postgres database

### Preview
The app is far from finished, and there are certainly many features to add. Nevertheless, I have deployed the app on AWS - for those interested, visit the link below
> [!IMPORTANT]
> [Feedback App](http://51.20.52.82:8080/)
> (for you to know, where you're going: http://51.20.52.82:8080/)

## Project structure
The app has a traditional structure - database, backend, frontend. Each layer is described in more detail below.

### Database
- created with **PostgreSQL**
- defined in backend files by employing Python's **SQLAlchemy**
- deployed using **Amazon Web Service RDS** functionality
- tables created (unless present already) with backend initialization (see db/init_db.py) 

![feedbackSummary - db](https://github.com/user-attachments/assets/9527d725-5865-4d52-bf59-8af63da30b6d)

### Backend
- 2 main components
  - **FastAPI** app to perform frontend requests (mainly database queries)
  - **OpenAI API** analyzer of text feedback
- containerized with **Docker**
- backend deployed a separate container using **AWS ECS**

The following are backend modules and their functionalities:
- *analyzer*
  - to facilitate comprehensive analysis of text, open-ended question feedback
  - selected feedback provided as a list, analyzer extracts overall sentiment
- *api*
  - *auth*
    - performs JWT user authentication
    - crucial for security and user identification (user role encoded in the JWT token)
    - each frontend request for DB access requires user authentication
  - *FastAPI*
    - set of APIs to perform frontend requests
    - SQL queries and call to OpenAI analysis functions
    - *schemas* - for FastAPI to know the shape of tables in the database 
    - *crud* - queries to the database to create, read, update or delete records
    - *routers* - API hooks
- *db*
  - all files used to define and initialize the PostgreSQL database

Other included files
- .env - contains environment variables used when running backend container locally; when deployed to AWS environment variables are manually input during configuration
- requirements.txt - list of used Python libraries (crucial for containerization)
- Dockerfile - defines, how the backend container is built

![feedbackSummary - backend](https://github.com/user-attachments/assets/c4bd9918-4f0a-4c34-b445-b28f55704167)

### Frontend
- TypeScript + React frontend app
- in the diagram below is a simplified structure of frontend showing individual pages and links between those pages
- **as I am not profficient in TypeScript, the front end was generated per partes using AI prompts**

Components:
- *Dashboard*
  - index/welcome page
- *Login*
  - login page, credentials sent to backend where they are authenticated
  - JWT token includes role, and user ID
- *StudentDashboard*
  - available feedback sessions are displayed
  - each session represented by its own SessionCard, when clicked user is directed to SessionDetail page
- *SessionDetail*
  - shows feedback entries for the users's (student's) courses and teachers - *TeacherCard*
  - when expanded, the TeacherCard shows questions in the session
  - if the student previously filled the feedback, the answers should be displayed in future logins
- *TeacherDashboard*
  - shows *Filters* to select only desired feedback (by feedback session, by course)
  - selected feedback is used to create *Summary*, that involves histogram (for rating questinos), pie chart (for yes-no) questinos, and AI analysis (for open-ended questions)
- *AdminDashboard*
  - used to create/modify/delete feedback sessions
  - each feedback session represented by its own collapsable *SessionEditorCard*
  - admin may change the session name, start and end date, and questions
 
![feedbackSummary - frontend](https://github.com/user-attachments/assets/3a81a44f-9f75-4a05-8ded-b745e15b7930)

There are many more files used by the front end app. To list them all would be exhaustive. Nevertheless, files are structured into folders by the file's purpose.
- *src/api*
  - to establish API connection to the backend
  - to send authentication credentials to the backend  
- *src/hooks*
  - frontend functions calling their backend API counterparts
- *src/components*
  - all features displyed in the UI dashboards
  - e.g. *TeacherCard*, *TextSummary*, *YesNoSummary*, *RatingHistogram*, *Header*...
- *src/pages*
  - user-accessed pages
  - minimal code, abstracted components from *src/components*

## Deployment
The app was deployed for public internet access on AWS. AWS offers a large number of functionalities to deploy a full stack app. I decided to deploy PostgreSQL using AWS's RDS, and back-/frontend using AWS's ECS.
The deployment process is described chronologically below.
    
    1. RDS Creation and Prerequsites
    - AWS-hosted relational database (PostgreSQL)
    - DB_HOST path to the database fed to the backend using environment variables
    - Containerized frontend and backend applications
    
    2. AWS Access and Registry Setup
    - Create private container repositories in AWS
    - Create and configure access credentials with permissions to manage container images
    - Set up local authentication to interact with AWS services
    
    3. Container Image Upload
    - Prepare frontend and backend images for the AWS container registry
    - Upload the images to the registry
    - Verify successful uploads and close credentials when finished
    
    4. ECS Deployment
    - Define an ECS task describing both containers, their ports, and environment variables
    - Create an ECS cluster using default settings
    - Create an ECS service from the task definition
    
    5. Networking and Exposure
    - Configure networking and security rules
    - Set up load balancing for public access to the frontend
    - Enable health checks to monitor application availability

## Conclusion
I have managed to deploy a full-stack somewhat functional app, and although the development was longer then expected, and the app still lacks functionalities, this project served its primary focus - to provide a learning platform for a variety of technologies. Should the app ever be used in practice, there are many additional functionalities, I can think of (e.g. profile edit page, other types of questions, better overall design to enable a more flexible usecase selection...). I believe, that the POC works, and further development would necessitate a thorougher requirement analysis. Nevertheless, I am happy with the result, and may come back to the project in the future.

<div align="center">
  <img src="https://github.com/user-attachments/assets/98e99942-7c39-477c-badb-f8e73ca3a34a" width="500">
</div>
