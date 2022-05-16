# tandur-backend
## How to Run on Local
1. Clone the project (git clone https://github.com/Tandur-Team/tandur-backend.git)
2. Open the project folder on VSCode
3. Open terminal in VSCode and run "npm install" to install all required dependencies
4. Run "npm run start" to start the server

## API Endpoint (LOCAL)
- Register: **POST** ip:port/user/signup
- Login: **POST** ip:port/user/login
- User Detail: **GET** ip:port/user/{userId}
- Add MyPlant: **POST** ip:port/user/{userId}/plant
- Get All MyPlants: **GET** ip:port/user/{userId}/plant
- Harvest MyPlant: **PATCH** ip:port/user/{userId}/plant/{plantId}
- Get All Plants: **GET** ip:port/plant
- Get Plant Detail: **GET** ip:port/plant/{plantId}

*ip = your PC IPv4 address*</br>
*port = 3000*
