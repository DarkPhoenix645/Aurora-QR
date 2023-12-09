# Steps to Run
- Rename ecosystem_sample.config.cjs to ecosystem.config.cjs
- Add MongoDB login URL in ecosystem.config.cjs
- npm install
- npm install -g pm2
- npm run init

# API Endpoints
## /signup
1. For registering new users which can be of type admin or normal user.
2. Admins can be registered only if the invite field is defined (to some pre-decided value) in the request body.
3. Request body must be raw JSON in the following format:
```
{
    "name": <String>,
    "email": <String>,
    "phone": <Number>,
    "gender": <String>,
    "college": <String>,
    "city": <String>,
    "dob": <ISO Date>,
    "password": <String>,
    "invite": <Number>
}
```
4. If the request is valid, a user will be created in the database and a QR code (image) will be sent back as the response.
5. The MongoDB ObjectID is encoded in the QR Code and thus used as an UUID for every user. 

## /verify
1. Request body must be raw JSON in the following format:
```
{
    "id": <MongoDB ObjectID String>,
    "adminId": <MongoDB ObjectID String>
}
```
2. If the adminId is valid and the id exists in the database, the user object is returned along with the message "User verified".
3. If the adminId is valid but the id does not exist in the database, a 404 is returned.
4. If the adminId is invalid, a 400 is returned.