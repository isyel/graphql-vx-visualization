# GraphQL Visualization Using VX

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Project Live Link: [Visit Site](https://github.com/facebook/create-react-app)

## _Solution Process_

I first mapped out all the possible visualization i could make from the data returned by the GraphQL API and best way i could represent them

### **Overall Data visualization**

- Top 3 topics with most probability for each available months - (BarChart with Carousel for each month)
- No of Posts created each month over time - (LinePath and AreaClosed)
- Authors with the most articles/posts - (BarChart Showing Top 6 Authors)
- No of times a topic had the most probability - (PieChart Showing Topics, and number of times it had highest probability)

### **Author Profile Visualization**

- Author's Posting frequency monthly over time (LinePath and AreaClosed)
- Top 3 topics with most probability for each month this Author Posted (BarChart with Carousel for each month)
- No of times a topic had the most probability across all author's posts

I then mapped out sample array data based on the visualization type

**Example 1** For AreaClosed, to plot a visualization of No of Posts vs Months

- Sample data array:
  `[ { date: 'january', posts: 20 }, { date: 'february', posts: 14 } ... { date: 'december', posts: 27 }]`

**Example 2** For PieChart, to plot a visualization of No of Posts and Topic having the most probability

- Sample data array:
  `[ { topic: 'birthday', posts: 20 }, { topic: 'fishing', posts: 32 } ... { topic: 'shopping', posts: 12 }]`

To create the above Object Arrays i used a combination of Maps, filters and sort
**Sample:** To create Array of Objects(date, posts)

First map and then select just one of each array using filter, this would be saved in data store for reusabilty with more than one component as "postsOfTheMonth"

```js
data.allPosts
	.map((post) => {
		const tempPosts = data.allPosts.filter(
			(eachPost) =>
				formatMonth(eachPost.createdAt) === formatMonth(post.createdAt)
		);
		return {
			date: formatMonth(post.createdAt),
			posts: tempPosts,
			topics: groupTopics(tempPosts),
		};
	})
	.filter(
		(monthPosts, index, self) =>
			index ===
			self.findIndex((singleObject) => singleObject.date === monthPosts.date)
	);
```

Then in component to plot timeline for number of posts per month, map out the data into an Array of Objects(date and posts)

```js
postsOfTheMonth
	.map((post) => ({
		date: post.date,
		posts: post.posts.length,
	}))
	.sort((post1, post2) => new Date(post1.date) - new Date(post2.date));
```

### **Managing State Data**

I used Context API to manage states across the applications, saving a structured data i could reuse across pages and components

Managed data like authors list and structure of author

**Sample** Authors Array in store showing number of posts per author

- Sample Data: `[{author: {…authorData}, id: "cklazcdi20009rk10bxj7o4tx", posts:[{…postData}, {…postData}, ... {…}] ... {…author}}`

### **Pages**

**Dashboard Page**

- Overall Data visualization
- List of Authors with links to individual profile page (Page routing is achieved using `react-router-dom`)

**Author's Profile Page**

- Author Profile Visualization
- Author Posts

### _Challenges_

_Managing using data across pages without having to call the graphQL API over and over again._

I resorted to using Context API to solve this, as useState and passing props down could not cut it.

### _Suggestions on API_

An author query structure that returns and Array of each author and the posts that belong to them, that would come in handy and would not require a mapping and filtering to create the data array for authors and their posts, the server can handle that complexity.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
