var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

app.get('/api/enrolladmin', async function (req, res) {
  try {
    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
        res.status(200).json({
          response: 'An identity for the admin user "admin" already exists in the wallet',
          created: false,
        });
        return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    wallet.import('admin', identity);
    
    console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    res.status(200).json({ 
      response: 'Successfully enrolled admin user "admin" and imported it into the wallet',
      created: true,
    });
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    res.status(500).json({ error: error });
  }
});

app.get('/api/registeruser', async function (req, res) {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (userExists) {
        console.log('An identity for the user "user1" already exists in the wallet');
        res.status(200).json({
          response: 'An identity for the user "user1" already exists in the wallet',
          created: false,
        });
        return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.exists('admin');
    if (!adminExists) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        res.status(200).json({
          response: 'An identity for the admin user "admin" does not exist in the wallet. Run the enrollAdmin.js application before retrying',
          created: false,
        });
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

    // Get the CA client object from the gateway for interacting with the CA.
    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
    const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
    const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    wallet.import('user1', userIdentity);
    console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');
    res.status(200).json({ 
      response: 'Successfully registered and enrolled admin user "user1" and imported it into the wallet',
      created: true,
    });

  } catch (error) {
    console.error(`Failed to register user "user1": ${error}`);
    res.status(500).json({ error: error });
  }
});

app.get('/api/queryallcars', async function (req, res) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryAllCars');
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.status(200).json({ response: result.toString() });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
  }
});

app.get('/api/query/:car_index', async function (req, res) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('queryCar', req.params.car_index);
    console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    res.status(200).json({ response: result.toString() });
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    res.status(500).json({ error: error });
  }
});

app.post('/api/addcar/', async function (req, res) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      res.status(500).json({ response: 'An identity for the user "user1" does not exist in the wallet. Run the registerUser.js application before retrying' });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
    await contract.submitTransaction('createCar', req.body.carid, req.body.make, req.body.model, req.body.color, req.body.owner);
    console.log('Transaction has been submitted');
    res.status(200).json({ response: 'Transaction has been submitted' });
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    res.status(500).json({ error: error });
  }
});

app.put('/api/changeowner/:car_index', async function (req, res) {
  try {
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      res.status(500).json({ response: 'An identity for the user "user1" does not exist in the wallet. Run the registerUser.js application before retrying' });
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');
    // Get the contract from the network.
    const contract = network.getContract('fabcar');
    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
    await contract.submitTransaction('changeCarOwner', req.params.car_index, req.body.owner);
    console.log('Transaction has been submitted');
    res.status(200).json({ response: 'Transaction has been submitted' });
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    res.status(500).json({ error: error });
  }
});

console.log('Server is running on port 8080...');
app.listen(8080);
