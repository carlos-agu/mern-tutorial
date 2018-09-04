import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";

export class Dashboard extends Component {
  componentWillMount() {
    this.props.getCurrentProfile();
  }

  render() {
    return <div>Dashboard </div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  getCurrentProfile
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
