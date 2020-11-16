import React, { Component } from 'react'
import axios from 'axios';
import URL from "./url";

class Dashboard extends Component {

    constructor() {
        super()
        this.state = {
            user1: "",
            user2: "",
            errors: {
                user1: "",
                user2: ""
            },
            result: null
        }
    }

    debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    componentWillMount() {
        this.delayedCallback = this.debounce(async function (event) {
            let isUserPresent1 = await axios.post(`${URL}/user`, { user: this.state.user1 });
            isUserPresent1 = isUserPresent1.data;
            console.log(isUserPresent1)
            if (this.state.user1) {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        errors: {
                            ...prevState.errors,
                            user1: isUserPresent1.message
                        }
                    }

                })
            }


            if (this.state.user2) {
                let isUserPresent2 = await axios.post(`${URL}/user`, { user: this.state.user2 });
                isUserPresent2 = isUserPresent2.data;
                console.log(isUserPresent2);
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        errors: {
                            ...prevState.errors,
                            user2: isUserPresent2.message
                        }
                    }

                })
                console.log(this.state);
            }

            // console.log(this.state);

        }, 500);
    }

    onChange = e => {
        this.setState({
            result: null
        })
        this.setState({ [e.target.id]: e.target.value });
        this.delayedCallback();
    };

    onSubmit = async (e) => {
        e.preventDefault();
        let result = await axios.post(`${URL}/get-users`, {
            user1: this.state.user1, user2: this.state.user2
        })
        result = result.data;
        if (result.success) {
            this.setState({
                result: result.users
            })
        } else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    errors: {
                        ...prevState.errors,
                        user2: result.message
                    }
                }
            })
        }
    }

    render() {
        const { errors, result } = this.state;
        return (
            <div className="container" style={{ marginTop: "5%" }}>
                <div className="row forms">
                    <div className="col s8">
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.user1}
                                    error={errors.user1}
                                    id="user1"
                                    type="text"
                                />
                                <label htmlFor="user1">Primary User</label>
                                <span style={{ color: "red" }}>{errors.user1}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.user2}
                                    error={errors.user2}
                                    id="user2"
                                    type="text"
                                />
                                <label htmlFor="user2">Secondary User</label>
                                <span style={{ color: "red" }}>{errors.user2}</span>
                            </div>

                            <div className="col s12" style={{}}>
                                <center><button
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                    disabled={this.state.errors.user1 || this.state.errors.user2}
                                >
                                    Submit
                            </button></center>
                                <br />
                            </div>
                        </form>
                        {result && result.length && (
                            <center><table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>HTML URL</th>
                                        <th>Node Id</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        result.map((user) => {
                                            console.log(user)
                                            return (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.login}</td>
                                                    <td><a href={user.html_url}>{user.html_url}</a></td>
                                                    <td>{user.node_id}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table></center>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard