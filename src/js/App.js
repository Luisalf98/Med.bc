import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Platform from '../../build/contracts/Platform.json'
import Content from './Content'
import Signup from './Signup'
import 'semantic-ui-css/semantic.min.css'
import 'react-vis/dist/style.css'
import {CircularProgress} from '@material-ui/core';
import { Loader } from 'semantic-ui-react'





class App extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      registered: false,
      loading: true,
      registering: false,
      name : ""
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
    

    this.platform = TruffleContract(Platform)
    this.platform.setProvider(this.web3Provider)

    this.registerAgent = this.registerAgent.bind(this)
    this.watchEvents = this.watchEvents.bind(this)
  }

  componentDidMount() {
    // TODO: Refactor with promise chain at('0x41b4ded52aeffc60c910e34b063cd5cde6a6cd1c') at('0xD1c5DC3522820E99BAAe79D270B9648922D2D9bB') 0xdea9352f7ba6fe2036480f9098afa194c7602425 sin MH actualización
    
    console.log("aro");
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      console.log(account)
      web3.currentProvider.publicConfigStore.on('update', function() {
        if (web3.eth.accounts[0] !== account) {
          account = web3.eth.accounts[0];
          window.location.reload(false);
        }
      });
      this.platform.at('0xdc03a73d1c9989ccc3beecaaf64ccb1022910070').then((platformInstance) => {
        this.platformInstance = platformInstance 
        console.log(this.platformInstance.address)
        
        this.watchEvents()
        return this.platformInstance.getAgentIndex({from:this.state.account})})
        .then((index) => {
          console.log("index : "+index.toNumber());
        var rgd = index == 0 ? false : true;
        this.setState({ registered:rgd, loading: false })
        
        }) 
      })
      
  }

  watchEvents() {
    // TODO: trigger event when vote is counted, not when component renders
    this.platformInstance.registerEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      if(event.args.agentAddress==this.state.account){
        this.setState({ registered: true })
      }
      
    })
  }

  registerAgent(name, uid, did, type) {
    //console.log("Name:------------------>"+type);
    this.setState({ registering: true })
    this.platformInstance.registerAgent(name,uid,did,type,{ from: this.state.account })
    /*.then(() =>
      //this.setState({ registered: true })
    )*/
  }



  render() {
    return (
      <div >
        <div >
          
          { this.state.loading
            ? <Loader active inline />
            : 
            !this.state.registered? 
            <Signup account={this.state.account} web3={this.web3} platformInstance={this.platformInstance} ></Signup>
            :
            <div style={{minHeight: '100vh'}}><Content registered={this.state.registered} account={this.state.account} web3={this.web3} platformInstance={this.platformInstance}
                /></div>
                
          }
        </div>
      </div> 
    )
  }
}

ReactDOM.render(
    <App/>,
   document.querySelector('#root')
)
