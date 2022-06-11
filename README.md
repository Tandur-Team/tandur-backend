# Tandur Backend
[![top-language][img-shield-languange]][JavaScript]

## Overview
This repository contains backend application projects used in Tandur mobile application (Android). There are several APIs that we build into multiple endpoints such as User Authentication (Login & Register), Crops/Plants Prediction, and CRUD for My Plants.

We use JavaScript programming language with Node.js environment. For the framework, we use Express because this framework is used to design and build webservice applications (RESTful API) quickly and easily.

## Contributors
| Name | Bangkit ID | GitHub |
| ------ | ------ | ------ |
| Muhammad Firdaus Maulana | C2123G1560 | [![github-follow][github-follow-daus]][github-daus] |
| Atharian Rahmadani | C2123G1561 | [![github-follow][github-follow-rian]][github-rian] |

## Requirements
- Code Editor ([Visual Studio Code] prefferable)
- [Node.js]
- [Postman]

## Project Installation
1. Clone the repository
```bash
git clone https://github.com/Tandur-Team/tandur-backend.git
```
2. Open the project directory on terminal
```bash
cd project_dir
```
4. Install all required dependencies
```bash
npm install
```

## Run The Application
Open Command Prompt/Powershell and type:
```bash
cd project_dir
npm run start
```

## API Endpoints
- Register: **POST** ip:port/user/signup
- Login: **POST** ip:port/user/login
- User Detail: **GET** ip:port/user/{userId}
- Add MyPlant: **POST** ip:port/user/{userId}/plant
- Get All MyPlants: **GET** ip:port/user/{userId}/plant
- Harvest MyPlant: **PATCH** ip:port/user/{userId}/plant/{plantId}
- Get All Plants: **GET** ip:port/plant
- Get Plant Detail: **GET** ip:port/plant/{plantId}

## Test The Application
1. Run the application (Check 'Run The Application' section)
2. Your application should be running on 127.0.0.1:8080/
3. Open POSTMAN
4. Set the method you want to test (Check 'API Endpoints' section), e.g GET
5. Set http://127.0.0.1:8080/ as the base URL.
6. Add endpoint on the end of base URL, e.g http://127.0.0.1:8080/plant/
7. Click Send
8. You should get a JSON response

## Deploy The Application to Cloud Run (Google Cloud Platform)
1. asdas
2. sadasd

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[JavaScript]: https://www.javascript.com/
[Visual Studio Code]: https://code.visualstudio.com/
[Node.js]: https://nodejs.org/en/
[Postman]: https://www.postman.com/

[img-shield-languange]: https://img.shields.io/github/languages/top/Tandur-Team/tandur-backend

[github-rian]: https://github.com/atharianr
[github-daus]: https://github.com/firdaus452maulana

[github-follow-rian]: https://img.shields.io/github/followers/atharianr?style=social
[github-follow-daus]: https://img.shields.io/github/followers/firdaus452maulana?style=social
