# Tandur Backend
## Overview
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
