# VCUMiniHacks26
Chef Lapin App
AI cookbook agent designed for users who want to cook with limited ingredients.

This web-app cookbook

Download all requirement files in frontend, backend, and agent. Then run npm run dev (make sure npm is installed). 

## Inspiration
We came up with the idea from the word Lapin, which means bunny in French. Our idea was to make a mini cookbook that recommends meals based on what the user has in their pantry.
## What it does
Creating a meal from limited ingredients is a frustrating ordeal. So chef Lapin creates meal recommendations that are generated from our pantry ingredients. It also has the option of filtering some of the given recommendations based on the user's preference (i.e. vegan, Italian, gluten-free, etc.)
## How we built it
Our project was separated into three technical parts: the frontend, the backend, and an agent. For the frontend, we used Next.js (React + TypeScript) to create the search page, the filters, and the recommendations once an ingredient has been searched. The backend was built using Node.js, Express.js, and implements Anthro Claude API. The agent we used was built using Hugging face API that we connected through API an OpenAI Model. 
## Challenges we ran into
Some challenges we ran into was an animation of Chef Lapin we worked on in React and css. It ended up looking more janky in the end piece and was scrapped due to it holding more bugs than we anticipated. Another challenge we ran into was working with our agent to get more refined recommendations based on our searches. 
## Accomplishments that we're proud of
The overall aesthetic of the application is something we are really proud of. Being able to accommodate towards users via filters is another thing we were proud of in Chef Lapin. Further, working with the agent to get more refined recommendations was quite time consuming, so getting it to where it is now is another accomplishment we take pride in. 
## What we learned
For some of us, just working git hub was a learning curve. For others it was working with an agent. Overall, all of us had some challenge we overcame with this project while improving our technical skills.
## What's next for Chef Lapin
Some improvements that could be made for Chef Lapin is to include the debugged animation of the bunny for a more interactive experience. Also, instead of using .json, we could switch to a database for a more refined agent. Another improvement that would be made is to have a wider expanse of recipes for the agent to be able to recommend from.
