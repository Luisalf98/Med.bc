import React from 'react'
import { getRelationships, getAgentByAddress, getPatientsDoctors, getFamilyDoctorRelationship, getRelationshipByAddressesNFD } from './Util'
import { Table, Dropdown, Loader, Grid } from 'semantic-ui-react'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
//import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Paper, FormControl, Select, OutlinedInput, MenuItem, CircularProgress } from '@material-ui/core';

/*const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);*/

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { patients: [], doctors: [], selected: "", agent: {}, isLoading: true, fdloaders:[]}
  }


  componentDidMount() {

    this.start();
    this.watchEvents();
  }

  start() {

    var agent = this.props.loggedAgent 

    this.setState({ agent: agent }, () => {

      getPatientsDoctors(this.props.platformInstance, this.props.web3).then((psds) => {
        //console.log(psds.patients);
       var booList=[]
        for (var i=0;i<psds.patients.length;i++){
          booList.push(false)
        }
        this.setState({fdloaders:booList})
        this.setState({ patients: psds.patients });
        var dcs = []
        psds.doctors.forEach(element => {
          dcs.push({ key: element.address, text: element.name, value: element.address });
        });
        this.setState({ doctors: dcs }, () => {
          this.setState({ isLoading: false })
          //console.log(this.state.doctors)
        });

      });
    });


  }


  onDoctorChange (i, value) {
      var booList = this.state.fdloaders;
      booList[i] = true;     
      this.setState({ i:i, value: value, fdloaders : booList });
    //console.log(i);
    //console.log(this.state.patients[i].address);
    getFamilyDoctorRelationship(this.props.platformInstance, this.state.patients[i].address).then((rs) => {
      getRelationshipByAddressesNFD(this.props.platformInstance, this.state.patients[i].address, value).then((rsba) => {
        if (rs == null && rsba == null) {
          //console.log("rs==null && rsba==null");
          this.props.platformInstance.addRelationship(this.state.patients[i].address, value, "fa", "fd", true, { from: this.props.loggedAgent.address })
          .catch(()=>{
            var booList = this.state.fdloaders;
            booList[i] = false;     
            this.setState({  fdloaders : booList });
          });
        } else if (rs == null && rsba != null) {
          //console.log("rs==null && rsba!=null");
          this.props.platformInstance.setOne(rsba.id, { from: this.props.loggedAgent.address })
          .catch(()=>{
            var booList = this.state.fdloaders;
            booList[i] = false;     
            this.setState({  fdloaders : booList });
          });
        } else if (rs != null && rsba == null) {
          //console.log(rs);

          //console.log("rs!=null && rsba==null");
          this.props.platformInstance.setOther(rs.id, value, { from: this.props.loggedAgent.address })
          .catch(()=>{
            var booList = this.state.fdloaders;
            booList[i] = false;     
            this.setState({  fdloaders : booList });
          });
        } else {
          //console.log("else");
          this.props.platformInstance.setBoth(rs.id, rsba.id, { from: this.props.loggedAgent.address })
          .catch(()=>{
            var booList = this.state.fdloaders;
            booList[i] = false;     
            this.setState({  fdloaders : booList });
          });
        }



      });

    });
  }

  watchEvents() {
    this.props.platformInstance.otherEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      var booList = this.state.fdloaders;
      booList[this.state.i] = false;
      var pts = this.state.patients;
      pts[this.state.i].fdAddress = this.state.value;
      this.setState({ patients: pts, fdloaders : booList  });     
    })
    this.props.platformInstance.bothEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      var booList = this.state.fdloaders;
      booList[this.state.i] = false;
      var pts = this.state.patients;
      pts[this.state.i].fdAddress = this.state.value;
      this.setState({ patients: pts, fdloaders : booList  }); 
    })
    this.props.platformInstance.oneEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      var booList = this.state.fdloaders;
      booList[this.state.i] = false;
      var pts = this.state.patients;
      pts[this.state.i].fdAddress = this.state.value;
      this.setState({ patients: pts, fdloaders : booList  }); 
    })
    this.props.platformInstance.relationshipEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      var booList = this.state.fdloaders;
      booList[this.state.i] = false;
      var pts = this.state.patients;
      pts[this.state.i].fdAddress = this.state.value;
      this.setState({ patients: pts, fdloaders : booList  }); 
    })
  }


  render() {
    const { classes } = this.props;
    if (this.state.isLoading) return (<Loader active inline />)
    return (

      <Grid columns={1}>
        <Grid.Row centered>
          <Grid.Column width={6}>
            <Table color="blue">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Username</Table.HeaderCell>
                  <Table.HeaderCell>Family Doctor</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.patients.map(row => (

                  <Table.Row>
                    <Table.Cell>{row.name}</Table.Cell>
                    <Table.Cell>{row.uid}</Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        placeholder='Select'
                        fluid
                        selection
                        value={row.fdAddress == null ? null : row.fdAddress}
                        options={this.state.doctors}
                        onChange={(e, { value }) => this.onDoctorChange(row.id - 1, value)}
                      />
                      <Loader active={this.state.fdloaders[row.id-1]} inline />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>

            </Table>

          </Grid.Column>
        </Grid.Row>
      </Grid>

    )
  }

}

const styles = theme => ({
  root: {
    width: 500,
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    margin: 'auto'
  },
  table: {
    minWidth: 200,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);