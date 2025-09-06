// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@account-abstraction/contracts/core/EntryPoint.sol";

contract SimplePaymaster is BasePaymaster {
    constructor(IEntryPoint _entryPoint)
        BasePaymaster(_entryPoint)
    {}

    // Called during validation of the UserOp
    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32, /*userOpHash*/
        uint256 /*maxCost*/
    ) internal override returns (bytes memory context, uint256 validationData) {
        // Example: always sponsor (unsafe!)
        return ("", 0);
    }

    function _postOp(
        PostOpMode,
        bytes calldata,
        uint256
    ) internal override {
        // no-op for simple sponsor
    }
}
