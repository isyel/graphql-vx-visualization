import Dashboard from "./components/Dashboard";
import AuthorProfile from "./components/AuthorProfile";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";

const client = new ApolloClient({
	uri: "https://fakerql.nplan.io/graphql",
	cache: new InMemoryCache(),
});

function App() {
	return (
		<div>
			<ApolloProvider client={client}>
				<Router>
					<Nav />
					<Switch>
						<Route exact path="/" component={Dashboard} />
						<Route exact path="/profile/:id" component={AuthorProfile} />
					</Switch>
				</Router>
			</ApolloProvider>
		</div>
	);
}

export default App;
