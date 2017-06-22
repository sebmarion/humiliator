import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, AppRegistry } from 'react-native';
import Button from 'react-native-button';


export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {showSettings:true, resultText:"Good job, you did it!", showTimeout:false, countdownStarted: false};
		this.minutesPicked = this.minutesPicked.bind(this);
		this.timeout = this.timeout.bind(this);
		this.countdownStarted = this.countdownStarted.bind(this);
		this.reset = this.reset.bind(this);
	}
	updateText(text){
	}
	minutesPicked(seconds){
		this.setState({seconds:seconds});
		this.countdown.changeSeconds(seconds,this.countdown);
	}
	timeout(){
		this.setState({showTimeout:true});
	}
	countdownStarted(){
		this.setState({countdownStarted:true});
		getCurrentPosition(function(){
		});
	}
	reset(){
		this.setState({countdownStarted:false});
		this.setState({showTimeout:false});
	}
	render() {
		var self = this;
		return (
			<View style={styles.container}>
				{ this.state.countdownStarted ? null:
					<View>
						<View style={styles.header}>
							<Text style={styles.textHeader}>How long do you want to run for?</Text>
						</View>
						<MyPicker onChange={this.minutesPicked}/>
					</View>
				}
				{ this.state.showTimeout ? null:
					<Countdown ref={instance => { this.countdown = instance; }} show={this.state.showSettings} onTimeout={this.timeout} onStart={this.countdownStarted}/>
				}
				{ this.state.showTimeout ?
					<View>
						<Text style = {styles.textSelectedVal}>{this.state.resultText}</Text>
						<Button style={styles.buttonStyle}
							onPress={this.reset}
						>
						Reset!
						</Button>
					</View>
					:null
				}
			</View>
		);
	}
}

export class MyPicker extends React.Component {
	constructor(props){
		super(props);
		this.state={seconds:0, showSettings:true};
		this.valueChange = this.valueChange.bind(this);
	}
	getList() {
		var vals = [];
		for (var i = 0; i < 300; i+=5){
			vals.push(i);
		}
		var minutes = vals.map((minute) => <Picker.Item key={minute} label={minute +" minutes"} value={minute*60} />);
		return minutes;
	}
	valueChange(itemValue, itemIndex) {
		this.setState({seconds:itemValue});
		this.props.onChange(itemValue);
	}
	render() {
		var self = this;
		var minutes = this.getList();
		return(
			<View style={styles.picker}>
				<Picker
					selectedValue={this.state.seconds}
					onValueChange={this.valueChange}>
					{minutes}
				</Picker>
			</View>
		);
	}
}

export class Countdown extends React.Component {
	constructor(props){
		super(props);
		this.state = {secondsRemaining:0, interval:false, displayedTime:"", hideGo:false, hideCounter:true};
		this.handleStart = this.handleStart.bind(this);
		this.changeSeconds = this.changeSeconds.bind(this);
	}
	changeSeconds(origSeconds){
		if (origSeconds <= 0){
			clearInterval(this.state.interval);
			this.setState({secondsRemaining:origSeconds});
			this.props.onTimeout();
			return true;
		}
		var sec_num = parseInt(origSeconds, 10); // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var pretty = hours+':'+minutes+':'+seconds;
		this.setState({displayedTime:pretty});
		this.setState({secondsRemaining:origSeconds});
		return true;
	}
	handleStart() {
		var self = this;
		this.setState({hideGo:true});
		var interval = setInterval(function() { self.changeSeconds(self.state.secondsRemaining-1)}, 1000);
		this.setState({interval:interval, showBtn:false, hideCounter:false});
		this.props.onStart();
		return true;
	}
	render(){
		return (
				<View>
					{ this.state.hideCounter ? null:
						<Text style = {styles.textSelectedVal}>{this.state.displayedTime}</Text>
					}
					{ this.state.hideGo ? null:
							<Go onPress={this.handleStart} />
					}
				</View>
		);
	}
}

export class Go extends React.Component {
	constructor(props){
		super(props);
		this.state = {showBtn:true};
	}
	render (){
		return (
			<View>
				{ this.state.showBtn ? 
					<View >
						<Button style={styles.buttonStyle}
							onPress={() => this.props.onPress()}
						>
						Ok go!
						</Button>
					</View>
				:null }
			</View>
		);
	}
}

const styles = StyleSheet.create({
	buttonStyle: {
		marginTop: 50,
		marginBottom: 10,
		marginRight:50,
		marginLeft:50,
		padding: 5,
		backgroundColor: '#5592F3',
		color:"#FFF"
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
	},
	textHeader: {
		fontSize: 20,
	},
	header: {
		alignItems: 'center',
	},
	textSelectedVal: {
		fontSize: 50,
		alignSelf: 'center',
		color: 'red'
	},
});
