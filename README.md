Please let me know if you think of a great new feature or enhancement, and especially if you find a bug! Also reach out if you have a question. It's a work in progress and everything can (and maybe should) change.

Background

As you walk up to the dog park, your pup's mind is racing about all the friends they are about to see. It's always a little disappointing if they come into the park but find no-one and then all they can do is sniff around. 

While that is sad for them, many times I found it equally as disappointing for me. Now I'm forced to tire out my high energy dog all by myself when all I wanted to do was listen to a podcast. :/

I wanted to be able to look ahead and know who else was at the park, to know what to expect. Or if there was a particularly large crowd in an area, it may lead me to discover new dog parks. This idea led me to build out this little example app.

I think this could also be used in this brave new COVID world, without dogs. As we all learn what social distancing means, we're finding ourselves re-discovering our city's parks. It may be nice to know, either to avoid or to go to, how many other people are at the park. 

The app should be fairly easy, after you sign-up, click on the map to tell people where you're heading. You can add follow more "Pups" by searching for their username and they'll show up on your map, or you can view all walks being taken now.
You'll want to adjust how far back in history you're looking at the walks. Without to many other people you may not see anything unless you include all past walks.

Technical

Social Pups was built by Matt Nestler

It was started with React Boilerplate to get us up and running as fast as possible.
The backend infrastructure was built using AWS Amplify. Which provides Authentication UI and backend. Then it provides an easy way to host and surface data from the DB. 
The Front End was built with vanilla React Bootstrap. The map components were MapBox GL.

Our React code is written using React Hooks instead of the life-cycle functions (componentDid... functions). We also used Redux to help manage the cross container state and to launch our sagas. In order to retrieve and push data to our backend we used Redux-Saga. In our saga's we would interface with the Amplify Graphql client. In this process we had to set our schema up to have proper permissions and proper Secondary Indexes to query all our data instead of scanning. Then the Amplify CLI built our query strings which we called and passed parameters to. This proved very straight forward and allowed great performance for our DynamoDB.