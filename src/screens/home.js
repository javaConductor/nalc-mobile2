// Home.js
import React from 'react'
import {Dimensions, Text, View} from 'react-native';
import {createAppContainer, NavigationEvents} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import systemCheck from "../services/system-check";
import auth from '../services/auth';
import Styles from '../screens/main-styles';
import ShowPost from '../screens/news/show-post';
import storage from "../services/storage";
import util from "../services/util";
import {Col, Grid} from "react-native-easy-grid";


const logo = require('../../assets/gldLogo72.png');

class Home extends React.Component {
	static navigationOptions = {
		title: 'Home',
		headerLeft: null
	};

	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
			isAuthenticated: false,
			dims: Dimensions.get('screen'),
			isLoading: true
		};
		this._isMounted = false;
	}

	async componentDidMount() {
		this._isMounted = true;
		//console.log("Home.componentDidMount");

		try {
			//console.log(`Home.componentDidMount: dim.screen ${JSON.stringify(Dimensions.get('screen'), null, 2)}  dim.window ${JSON.stringify(Dimensions.get('window'))}`);
			await systemCheck.check();
			//console.log('Home.componentDidMount: check OK');
		} catch (e) {
			console.error(`Home.componentDidMount: check FAILED!!! ${util.errorMessage(e)}`);
			throw e;
		}

		try {
			const isAuthenticated = await auth.isUserAuthenticated();
			//console.log(`Home.componentDidMount: setting isAuthenticated: ${isAuthenticated}`);
			const origPosts = await storage.getNewsPosts();
			//console.log(`Home.componentDidMount: origPosts: ${JSON.stringify(origPosts)}`);

			//const posts = origPosts.reverse();// move the latest to the front
			const lastPost = origPosts[0];
			const nextToLastPost = origPosts[1];

			//console.log(`Home.componentDidMount: lastPost: ${JSON.stringify(lastPost)}`);

			if (this._isMounted)
				this.setState((prevState) => {
					return {
						...prevState,
						isAuthenticated,
						dims: Dimensions.get('screen'),
						isLoading: false,
						lastPost,
						nextToLastPost
					}
				});

		} catch (e) {
			console.error(`Home.componentDidMount: ERROR: ${util.errorMessage(e)}`);
			throw e;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {

		if (this.state.isLoading)
			return null;
		//console.log(`Home.render: userIsAuthenticated: ${this.state.isAuthenticated}`);
		const {lastPost, nextToLastPost} = this.state;
		return (<View style={Styles.container}>
				<NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>
				<Grid>

					<Col size={10}>
						<View style={{...Styles.logoContainer, zIndex: 0,}}>
							<Text style={Styles.homeLabel}> Latest News </Text>
							<ShowPost post={lastPost}/>
							<ShowPost post={nextToLastPost}/>
						</View>
					</Col>
				</Grid>
			</View>
		);
	}
}

const AppNavigator = createStackNavigator({
	Home: {
		screen: Home,
	},
});

export default createAppContainer(AppNavigator);

