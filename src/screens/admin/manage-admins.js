// ManageAdmins.js
import React from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import Users from '../../services/users';
import {withNavigation} from 'react-navigation';
import {Col, Grid, Row} from "react-native-easy-grid";


const STATUS_SUSPENDED = "Suspended";
const STATUS_ACTIVE = "Active";

class ManageAdmins extends React.Component {
	static navigationOptions = {
		title: 'Manage Administrators',
	};
	state = {
		admins: undefined,
		isLoading: true,
		errorLoading: false
	};

	constructor(props) {
		console.log(`ManageAdmins.constructor(props: ${JSON.stringify(props)})`);
		super(props);
	}

	async componentWillMount() {
		console.log("ManageAdmins.componentWillMount");
		try {
			const admins = this.props.navigation.state.params.admins || await Users.getAdmins();
			console.log(`ManageAdmins.componentWillMount(): admins: (${JSON.stringify(admins, null, 2)})`);
			this.setState({admins, isLoading: false});
		} catch (e) {
			console.log(`ManageAdmins.componentWillMount(): error: (${JSON.stringify(e, null, 2)})`);
			this.setState({...this.state, errLoading: true, error: e});
		}
	}

	componentDidMount() {
		console.log(`ManageAdmins.componentDidMount(): admins: (${JSON.stringify(this.props, null, 2)})`);
	}

	renderError(e) {
		return (<Text>
				Error loading admin list {e}
			</Text>
		)
	}

	renderLoading() {
		return null;
	}

	render() {
		const {admins = [], isLoading, errLoading, error} = this.state;

		if (errLoading)
			return this.renderError(error);
		if (isLoading)
			return this.renderLoading();
		const {navigate} = this.props.navigation;

		const adminList = admins.map((admin) => this.renderAdmin(admin, this.props));
		const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : "";
		return <View style={styles.container}>
			<Grid>
				<Row>
					{/*<View style={styles.adminRow}>*/}
					<Col size={5}>
						<Text style={styles.rowHeader}>Administrator Name</Text>
					</Col>
					<Col size={1}>
						<Text style={styles.rowHeader}>Actions</Text>
					</Col>
					{/*</View>*/}
				</Row>
				<Button style={{alignSelf: 'center'}} title={"New Admin"} onPress={() => {
					navigate('EditAdmin', {})
				}}/>
				{adminList}
			</Grid>
		</View>
	}

	renderAdmin(admin, props) {
		//console.log(`ManageAdmins.renderAdmin: props: ${JSON.stringify(props)}`);
		//console.log(`ManageAdmins.renderAdmin: state: ${JSON.stringify(this.state)}`);
		//console.log(`ManageAdmins.renderAdmin(${JSON.stringify(admin)})`);
		const {navigate} = props.navigation;
		const {id, firstName, lastName, permissions, email} = admin;
		return (<Row key={admin.id}>
			<Col size={5} style={styles.rowCol}>
				<Text onPress={() => {
					navigate('EditAdmin', {admin})
				}}>{`${firstName} ${lastName}`}</Text>
			</Col>
			<Col size={1} style={styles.rowCol}>
				{/*<Button title={'Suspend'} onPress={() => this.onSuspendAdmin(admin)}/>*/}
				<Button
					title={'Remove'} onPress={() => this.onRemoveAdmin(admin)}/>
			</Col>
		</Row>);
	}

	onSuspendAdmin(admin) {
		const {navigate} = this.props.navigation;
		/// Set it to status ='Suspended'
	}

	async onRemoveAdmin(admin) {
		const {navigate} = this.props.navigation;
		console.log(`ManageAdmins.onRemoveAdmin(${JSON.stringify(admin, null, 2)})`);

		const newList = await Users.removeAdmin(admin.id);
		this.setState((prevState) => {
			return {...prevState, admins: newList}
		});
		console.log(`ManageAdmins.onRemoveAdmin(${JSON.stringify(admin, null, 2)}): newList: (${JSON.stringify(newList, null, 2)})`);
		navigate('ManageAdmins', {admins: newList});
	}
}

export default withNavigation(ManageAdmins);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		//alignItems: 'stretch',
		borderWidth: 1,
	},
	adminRow: {
		flex: 1,
		flexDirection: 'row'
	},
	adminName: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		width: '80%'
	},
	adminActions: {
		justifyContent: 'flex-end',
		width: '20%',
		flexDirection: 'row'
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