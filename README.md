# Tandur Backend
[![Platform](https://img.shields.io/github/languages/top/Tandur-Team/tandur-backend)](https://www.javascript.com/)
## Overview
This repository contains backend application projects used in Tandur mobile application (Android). There are several APIs that we build into multiple endpoints such as User Authentication (Login & Register), Crops/Plants Prediction, and CRUD for My Plants.

We use JavaScript programming language with Node.js environment. For the framework, we use Express because this framework is used to design and build webservice applications (RESTful API) quickly and easily.

## Requirements
- Code Editor (Visual Studio Code preffered)
- NodeJS
- Postman

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
4. Start the server
```bash
npm run start
```
## API Endpoint
- Register: **POST** ip:port/user/signup
- Login: **POST** ip:port/user/login
- User Detail: **GET** ip:port/user/{userId}
- Add MyPlant: **POST** ip:port/user/{userId}/plant
- Get All MyPlants: **GET** ip:port/user/{userId}/plant
- Harvest MyPlant: **PATCH** ip:port/user/{userId}/plant/{plantId}
- Get All Plants: **GET** ip:port/plant
- Get Plant Detail: **GET** ip:port/plant/{plantId}

## Testing The Application
