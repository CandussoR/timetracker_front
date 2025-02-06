# timetracker-front

This project is the front-end related to my [timetracker](https://github.com/CandussoR/timetracker) and is destined to be both the Web App and Desktop App (with Tauri).

Current State : under development - css and html are left shaky on purpose for now.

# Install process
* First clone the back repository (and [follow the steps](https://github.com/CandussoR/timetracker/blob/master/README.md) to create a virtual environnement to launch it) :  
  `git clone https://github.com/CandussoR/timetracker.git`  
* Clone this repository :  
  `https://github.com/CandussoR/timetracker_front.git`  
* `cd` into your repo ;  
* `npm install` ;
* After having launched the back repo with the arg `--api` (see [this readme](https://github.com/CandussoR/timetracker/blob/master/README.md)), get the URL on which your server is running, and create a `.env` file at the root of your folder with :
```env
VITE_APP_IP_DEV = <your.server.adress:port>
VITE_APP_RING = "./src/assets/timer_end.mp3"
```
* Run your project with `npm run dev`.
