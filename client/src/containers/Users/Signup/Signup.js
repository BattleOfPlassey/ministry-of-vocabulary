import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkUserUniqueness, userSignupRequest } from '../../../store/actions/usersActions'
import InputField from '../../../components/InputField/InputField';
import { NavLink, Link } from 'react-router-dom';

// Check if E-mail is Valid or not
const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const FIELDS = [    
    {name: 'email', type: 'email', label: 'E-mail', placeholder: 'Enter your email address'},
    {name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password' },
    {name: 'confirmPassword', type: 'password', label: 'Confirm Password', placeholder: 'Confirm password'}
];

class Signup extends Component {
    state = {
        userDetails: {},
        errors: {}
    };

    componentWillMount() {
        if (localStorage.getItem('SignupPage') !== null ) {
            const { userDetails, errors } = JSON.parse(localStorage.getItem('SignupPage'));
            this.setState(prevState => {
                return {
                    ...prevState,
                    userDetails: {...userDetails},
                    errors: {...errors}
                };
            });
        }
    }

    commonValidation = (field, value) => {
        let error = {};
        if (value === '') {
            error[field] = 'This field is required';
        } else {
            if (field === 'email' && !validateEmail(value)) {
                error[field] = 'Not a valid Email';
            } else if (field === 'password' && value.length < 4) {
                error[field] = 'Password too short';
                if (this.state.errors['confirmPassword'] !== '' && value === this.state.userDetails.confirmPassword) {
                    error['confirmPassword'] = '';
                }
            } else if (field === 'confirmPassword' && value !== this.state.userDetails.password) {
                error[field] = 'Passwords do not match';
            } else {
                error[field] = '';
            }
        }
        return error;
    }

    userUniqueness = async ({ field, value }) => {
        const uniquenessError = await this.props.checkUserUniqueness({ field, value })
            .then(res => res.json())
            .then(res => {
                let result = {};
                if (res.error) {
                    result = res.error;
                } else {
                    result[field] = '';
                }
                return result;
            });
        return uniquenessError;
    }

    handleInputChange = async (e) => {
        const field = e.target.name;
        const value = e.target.value;
        let errors = {...this.state.errors};

        const commonValidationError = await this.commonValidation(field, value);
        let uniquenessError = {};
        if (( field === 'email') && value !== '') {
            uniquenessError = await this.userUniqueness({ field, value });
            errors = { ...errors, [field]: commonValidationError[field] || uniquenessError[field] };
        } else {
            errors = { ...errors, ...commonValidationError };
        }

        this.setState((prevState) => {
            return {
                ...prevState,
                userDetails: {
                    ...prevState.userDetails,
                    [field]: value
                },
                errors: {...errors}
            };
        }, () => localStorage.setItem('SignupPage', JSON.stringify(this.state)));
    }

    handleSignup = (e) => {
        e.preventDefault();
        let errors = {...this.state.errors};
        const userDetailsValid = Object.keys(errors).filter(field => errors[field] !== "").length === 0 ? true : false;
        if (!userDetailsValid){
            return;
        }
        else {
            this.props.userSignupRequest(this.state.userDetails)
            .then(res => res.json())
            .then(res => {
                if (res.errors) {
                    errors = {...errors, ...res.errors};
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            userDetails: {...prevState.userDetails},
                            errors: {...errors}
                        };
                    });
                } else {
                    localStorage.removeItem('SignupPage');
                    this.props.history.push('/login');
                }
            })
        }
    }

    componentWillUnmount() {
        localStorage.removeItem('SignupPage');
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        const inputFields = FIELDS.map(field =>
            <InputField key={field.name}
                        type={field.type} name={field.name} label={field.label}
                        defaultValue={this.state.userDetails[field.name]}
                        errors={this.state.errors}
                        placeholder={field.placeholder}
                        onChange={this.handleInputChange} />
        )
        return (
            <div className="container">
                <br />
                <h3 className="text-center">Join Our Community!</h3>
                <div className="jumbotron">
                    <form onSubmit={this.handleSignup}>
                        { inputFields }
                        <button className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
                Already registered? <Link className="ui item" to='/login'>Login now</Link>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.users.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkUserUniqueness: (userInputDetails) => dispatch(checkUserUniqueness(userInputDetails)),
        userSignupRequest: (userSignupDetails) => dispatch(userSignupRequest(userSignupDetails))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
