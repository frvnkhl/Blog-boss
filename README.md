# Blog-boss
## Project description
This is my second full-stack project which is a simple blog app where you have to have an account to see the articles, which have their respective categories and tags. Users can add and like articles, they can add and like comments and they can even follow other users.

For this project I wanted to create MERN app but with several URLs for the client side. At first I looked at react router but then saw that nextjs has all those capabilities as well. At that time, I didn't know that next.js is actually a full-stack framework therefore for some using it for the client side only might be overkill, but at least it works well. For my backend I used node.js and express and both client and server sides are hosted separately on heroku and communicate together via REST endpoints.

This is my second full-stack project where I managed to implement all the functionalities like JWT authentication, 3rd party login, rendering data from database etc., so this part was fairly easy since I already had some experience doing that. My main challenge this with this app was to create relationships in nosql database to implement features such as adding and liking comments, adding and liking articles and following users.

### Main features
- Register to the app with username & password
- Secure the passwords in the db with the help of hashing
- Login to the app with the help of JWT
- Login/register to the app via 3rd party, Google and Facebook
- Create and like articles, with assigned categories, tags
- Add and like comments
- Follow other users
- Users can change passwords
- Each profile has its profile page with information about their articles and articles they liked
- Search feature that looks up article based on their tags, title and content

### App demo
[Here's the link to the demo app](https://blog-boss-client.herokuapp.com/)

To try out all the functionalities, you have to sign up first. You can register with username and password or use 3rd party sign up via Google or Facebook. In case you'd like your account deleted at the end, just [message me](mailto:uhalfr@pm.me) and I'll do so asap.

## Dependencies
### Backend
- bcrypt
- body-parser
- cors
- dotenv
- dotenv-cli
- express
- express-session
- jsonwebtoken
- mongoose
- mongoose-findorcreate
- passport
- passport-facebook
- passport-google-oauth20
- passport-jwt
- passport-local-mongoose
- chai
- mocha
- supertest

### Frontend
- @mui/icons-material
- @mui/material
- @tiptap/extension-heading
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-underline
- @tiptap/react
- @tiptap/starter-kit
- axios
- dotenv
- draft-js
- html-react-parser
- jwt-decode

## Credits
Even though I did the app by myself, I need to give some credits to few amazing people/organisations out on the internet that helped me made this thing happen. They helped me a lot once I was stuck and I can't thank them enough!

- Trying many rich text editors it was quite a challenge to find one that would work well with next.js and then render content to html to use later. That was until I found [tiptap](https://tiptap.dev/). Their documentation was easy to follow, components were simple to implement and did everything I wanted it to do.
- Applying async functions, it was a tad bit challenging to work with promises the way I needed to. Thankfully, [this article by Katsiaryna (Kate) Lupachova](https://dev.to/ramonak/javascript-how-to-access-the-return-value-of-a-promise-object-1bck) helped me a lot. She broke down easily what promises are, how to return the value from a promise (thing I needed to figure out) and overall saved a me a whole lot of headaches in the promise hell.
