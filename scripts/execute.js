const hre = require("hardhat");

const EP_address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
const AF_address = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"

AF_NONCE =2;

async function main() {
    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_address);

    // const sender = await hre.ethers.getCreateAddress({
    //     from : AF_address, 
    //     nonce: AF_NONCE});
    // console.log("Sender", sender);

    const [signer] = await hre.ethers.getSigners();
    const addr1 = await signer.getAddress();
    // const addr2 = await signer2.getAddress();
    // console.log(addr1.toString);

    const Account = await hre.ethers.getContractFactory("Account");
    
    let initCode = AF_address + AccountFactory.interface.encodeFunctionData("createAccount", [addr1]).slice(2);

    // let initCode2 = AF_address + AccountFactory.interface.encodeFunctionData("createAccount", [addr2]).slice(2);
    // console.log("init code", initCode);

    let sender // was getting AA14 initCode must return sender so commented out line 13 to 15 and uncommented out  26 to 31
    try {
        await EntryPoint.getSenderAddress(initCode);
    } catch (error) {
        console.log(error.data);
        sender = "0x" + error.data.data.slice(-40);
    
        
    }
    // let client // was getting AA14 initCode must return sender so commented out line 13 to 15 and uncommented out  26 to 31
    // try {
    //     await EntryPoint.getSenderAddress(initCode2);
    // } catch (error) {
    //     console.log(error.data);
    //     sender = "0x" + error.data.data.slice(-40);}
    
    console.log("before sender balance", await EntryPoint.balanceOf(sender));

    await EntryPoint.depositTo(sender, {
        value: hre.ethers.parseEther("2"),
    });
    console.log("deposit was successful to", sender);
    console.log("Sender", sender);

    const code = await hre.ethers.provider.getCode(sender);
    if (code !== "0x") {
        initCode = "0x";
    }
    //  const code2 = await hre.ethers.provider.getCode(client);
    // if (code2 !== "0x") {
    //     initCode2 = "0x";
    // }
    console.log(" A thing")

    

    // console.log(await hre.ethers.provider.getCode(sender)); // check if deployed

    // console.log("Addr1", addr1);




    // const nonce = await EntryPoint.getNonce(sender, 0);
    // const calldata = Account.interface.encodeFunctionData("counter");
    // console.log("nonce", nonce);
    // console.log("calldata", calldata);

    userOp = {
        sender,
        nonce : await EntryPoint.getNonce(sender, 0),
        initCode,
        callData: Account.interface.encodeFunctionData("counter"),
        callGasLimit:400_000,
        verificationGasLimit: 400_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseUnits("30","gwei"), //changed to parseUnits line 56 & 57
        maxPriorityFeePerGas: hre.ethers.parseUnits("30","gwei"),
        paymasterAndData: "0x",
        signature: "0x",
    }
    // console.log("userop", userOp);
    console.log(" A thing2")


    const userOpHash = await EntryPoint.getUserOpHash(userOp);
    // console.log("user op hash", userOpHash);

    const signature = await signer.signMessage(hre.ethers.getBytes(userOpHash));
    // console.log("signature", signature);

    userOp.signature = signature;
    // console.log("signature", signature);



    const txHash = await EntryPoint.handleOps([userOp], addr1); //was getting a FailedOp(0, "AA23 reverted: ECDSA: invalid signature length") so added signature line 64 & 67
    // console.log("tx hash", txHash);

    const deployedAccount = await hre.ethers.getContractAt("Account", sender);


    const count = await deployedAccount.count();
    console.log("Count value in Account:", count.toString());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});