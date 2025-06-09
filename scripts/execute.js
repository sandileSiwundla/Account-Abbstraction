const hre = require("hardhat");

const EP_address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
const AF_address = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

AF_NONCE =1;

async function main() {
    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_address);

    const sender = await hre.ethers.getCreateAddress({
        from : AF_address, 
        nonce: AF_NONCE});
    console.log("Sender", sender);

    const [signer] = await hre.ethers.getSigners();
    const addr1 = await signer.getAddress();
    console.log("Addr1 ", addr1);

    const Account = await hre.ethers.getContractFactory("Account");
    
    const initcode = AF_address + AccountFactory.interface.encodeFunctionData("createAccount", [addr1]).slice(2);
    console.log("init code", initcode);

    // let sender
    // try {
    //     await EntryPoint.getSenderAddress(initcode);
    // } catch (error) {
    //     console.log(error.data);
    //     sender = "0x" + error.data.data.slice(-40);
    
        
    // }

    // console.log(sender);



    // const nonce = await EntryPoint.getNonce(sender, 0);
    // const calldata = Account.interface.encodeFunctionData("counter");
    // console.log("nonce", nonce);
    // console.log("calldata", calldata);

    userOp = {
        sender,
        nonce : await EntryPoint.getNonce(sender, 0),
        initcode,
        calldata: Account.interface.encodeFunctionData("counter"),
        callGasLimit:400_000,
        verificationGasLimit: 400_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseEther("30","gwei"),
        maxPriorityFeePerGas: hre.ethers.parseEther("30","gwei"),
        paymasterAndData: "0x",
        signature: addr1,
    }
    console.log("userop", userOp);

    // const txHash = await EntryPoint.handleOps([userOp], addr1);
    // console.log("tx hash", txHash);

    const userOpHash = await EntryPoint.getUserOpHash(userOp);
    console.log("user op hash", userOpHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});