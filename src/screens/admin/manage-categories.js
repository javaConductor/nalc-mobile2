// ManageCategories.js
import React from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import categoryService from '../../services/categories';
import {NavigationEvents} from "react-navigation";
import {Col, Grid, Row} from "react-native-easy-grid";


export default class ManageCategories extends React.Component {
	static navigationOptions = {
		title: 'Manage Categories',
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}

	async componentDidMount() {
		this.setState((prevState) => {
			return {...prevState, isLoading: true}
		});
		const {navigate} = this.props.navigation;
		try {
			const categories = await categoryService.getCategories();
			//console.log(`ManageCategories.componentDidMount: categories: (${JSON.stringify(categories)})`);

			this.setState((prevState) => {
				return {...prevState, isLoading: false, categories}
			});
		} catch (e) {
			if (typeof e === 'object' && (e.authenticationRequired || e.badToken)) {
				navigate("Login", {target: "ManageCategories"});
			}
		}
	}

	render() {
		if (this.state.isLoading)
			return null;
		const {navigate} = this.props.navigation;
		//console.log(`ManageCategories.render: categories: (${JSON.stringify(this.state.categories)})`);

		return (
			<View style={styles.container}>
				<NavigationEvents onWillFocus={this.componentDidMount.bind(this)}/>
				<Text style={styles.header}>Manage Categories</Text>
				<Button onPress={() => navigate('EditCategory', {})} title={"Add New Category"}/>
				<Grid>
					<Row>
						<Col size={1}><Text style={styles.rowHeader}>Name</Text></Col>
						{/*<Col size={1}><Text>Slug</Text></Col>*/}
						<Col size={2}><Text style={styles.rowHeader}>Description</Text></Col>
					</Row>
					{this.state.categories.map(this.renderRow.bind(this))}
				</Grid>
			</View>
		)
	}

	onRemove(categoryId) {

	}

	renderRow(category) {
		const {navigate} = this.props.navigation;

		return (<Row key={category.id}>
				<Col style={styles.rowCol} size={1}><Text
					onPress={() => navigate('EditCategory', {category})}>{category.name}</Text></Col>
				{/*<Col  size={1}><Button title={category.slug} onPress={() => navigate('EditCategory', {category})}/></Col>*/}
				<Col style={styles.rowCol} size={2}><Text
					onPress={() => navigate('EditCategory', {category})}>{category.description}</Text></Col>
			</Row>
		);

	}

	addNewCategory() {

	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'stretch',
		borderWidth: 1,
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	rowCol: {
		borderWidth: 1,
		borderColor: 'black'
	},

	rowHeader: {
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	header: {
		fontWeight: 'bold',
		fontSize: 18,
		alignSelf: 'center',
	}
});