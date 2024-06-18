# OpenSidewalkMap

[OpenSidewalkMap](https://www.opensidewalkmap.com/)

Use data from [OpenStreetMap](https://www.openstreetmap.org/) to highlight sidewalks on the map. Lets you easily see what places are accesible by foot and what sidewalks are missing
## Acknowledgements

 - This project is based on a fork of [OpenParkingMap](https://github.com/brandonfcohen1/openparkingmap)
 - Not to be confused with the OSWM (also "OpenSidewalkMap") project by [Kauê Vestena](https://github.com/kauevestena). You can access the main repository of that project [here](https://github.com/kauevestena/opensidewalkmap)
## Installation

To install this project, you will require an API key from mapbox. Go to https://www.mapbox.com/, create an account and API key before continuing.

### 1. Clone the project
```bash
$ git clone https://github.com/CurtisGreen/opensidewalkmap.git
```

### 2. Install dependencies
```bash
$ npm install
```
### 3. Configure environment variables
You may populate environment variables in your system environment or within a `.env` file.

**OPTION 1:** As a system environment variable
```bash
$ export NEXT_PUBLIC_MAPBOX_TOKEN=TOKEN_HERE
```

**OPTION 2:** As a `.env` file

This file will be ingored in your commits, but still be careful not to commit or share this file. When the project runs, it will check for the presence of this file and use the values automatically.

1. Clone `.env.template` and rename as `.env`
2. Replace `TOKEN_HERE` with your Mapbox API Token

### 4. Run the project
```bash
$ npm run dev
```

The project will be accesible on http://localhost:3000
    