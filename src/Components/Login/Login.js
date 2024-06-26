import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


class ConnectedLogin extends Component {
  state = {
    userName: "",
    pass: "",
    redirectToReferrer: false
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // If user was authenticated, redirect her to where she came from.
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",

        alignItems: "center",
      }}>
        <div
          style={{
            height: 300,
            width: 200,
            padding: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <Avatar style={{ marginBottom: 10 }}>
            <LockOutlinedIcon />
          </Avatar>
          <div
            style={{
              marginBottom: 20,
              fontSize: 24,
              textAlign: "center"
            }}
          >
            {" "}
            Log in
            {" "}
          </div>
          <TextField
            value={this.state.userName}
            placeholder="User name"
            onChange={e => {
              this.setState({ userName: e.target.value });
            }}
          />
          <TextField
            value={this.state.pass}
            type="password"
            placeholder="Password"
            onChange={e => {
              this.setState({ pass: e.target.value });
            }}
          />
          <Button
            style={{ marginTop: 20, width: 200 }}
            variant="outlined"
            color="primary"
            onClick={() => {

              // Simulate authentication call
              Auth.authenticate(this.state.userName, this.state.pass, async user => {
                if (!this.state.userName || !this.state.pass || !user) {
                  this.setState({ wrongCred: true });
                  return;
                } else {
                    // auth
                    let users = [];
                    await fetch(`http://localhost:3000/user-id?email=${this.state.userName}`)
                    .then(function(response) {
                        return response.json()
                    }).then(function(data) {
                        users = data.users;
                    });

                    if (users.length === 0) {
                        this.setState({ wrongCred: true });
                        return;
                    }

                    if (users[0].password !== this.state.pass) {
                        this.setState({ wrongCred: true });
                        return;
                    }
                
                    // accept
                    this.props.dispatch(setLoggedInUser({ name: user.name, user: users[0] }));
                    this.setState(() => ({
                      redirectToReferrer: true
                    }));
                }
              });
            }}
          >
            Log in
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
        </div>
      </div>
    );
  }
}
const Login = withRouter(connect()(ConnectedLogin));

export default Login;
