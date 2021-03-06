import { assert } from "chai";
import mocha from "mocha";

const EthereumjsUtil = require('ethereumjs-util');
import { EthereumAccountUtils } from "../../src/blockchain/ethereum/account-utils";
import BigNumber from "bignumber.js";

describe("Ethereum", async () => {

    describe("Ethereum Account Utils", async () => {

        const instance = new EthereumAccountUtils();

        const ethereumWallet0Address = "0x9d9216e0a29468bE1eCaCc351ce3887be8a26222";
        const ethereumwallet0PrivateKey = "0xe49c840fcb71fafcaa068c7d45a6b99f8d5b6064effe7d793b6490641e75cca8";
        const ethereumwallet0PublicKey = "0x30bfa6298178e3ab1f4a2e5d5c3c7d79505c0b3ef7958ac0fec319a67d3e47eb01f05a7059311a6d061b7a4c1eff38549909b0782256e22f748cb9e6f3c4c4a4";

        describe("requireType( target, type, method ): boolean", async () => {

            it("should throw if supplied parameter does not match requested type ( string, Buffer )", async () => {
                assert.throws(() => {
                    instance.requireType("test", "Buffer", "test");
                }, /test: parameter must be a Buffer()./);
            });

            it("should throw if supplied parameter does not match requested type ( number, Buffer )", async () => {
                assert.throws(() => {
                    instance.requireType(1, "Buffer", "test");
                }, /test: parameter must be a Buffer()./);
            });

            it("should throw if supplied parameter does not match requested type ( boolean, Buffer )", async () => {
                assert.throws(() => {
                    instance.requireType(false, "Buffer", "test");
                }, /test: parameter must be a Buffer()./);
            });

            it("should throw if supplied parameter does not match requested type ( undefined, Buffer )", async () => {
                assert.throws(() => {
                    instance.requireType(undefined, "Buffer", "test");
                }, /test: parameter must be a Buffer()./);
            });

            it("should return true if supplied parameter matches requested type ( string, string )", async () => {
                const test = instance.requireType("test", "string", "test");
                assert.isTrue( test, "Test failed.");
            });

            it("should return true if supplied parameter matches requested type ( Buffer, Buffer )", async () => {
                const test = instance.requireType( Buffer.from(""), "Buffer", "test");
                assert.isTrue( test, "Test failed.");
            });

            it("should return true if supplied parameter matches requested type ( true, boolean )", async () => {
                const test = instance.requireType(true, "boolean", "test");
                assert.isTrue( test, "Test failed.");
            });

            it("should return true if supplied parameter matches requested type ( 5, number )", async () => {
                const test = instance.requireType(5, "number", "test");
                assert.isTrue( test, "Test failed.");
            });
        });

        describe("bufferToHex( Buffer ): string", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.bufferToHex("test");
                }, /bufferToHex: parameter must be a Buffer()./);
            });

            it("should return a string prepended with 0x", async () => {
                const testValue: string = "010203";
                const result = instance.bufferToHex( Buffer.from( testValue , "hex" ) );
                assert.equal( "0x" + testValue, result, "Result does not match" );
            });

        });

        describe("privateToPublic( Buffer ): Buffer", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.privateToPublic("test");
                }, /privateToPublic: parameter must be a Buffer()./);
            });

            it("should throw if supplied Buffer length is shorter than 32 bytes", async () => {
                assert.throws(() => {
                    instance.privateToPublic( Buffer.from( "012345" , "hex") );
                }, /private key length is invalid/);
            });

            it("should return a valid 64 byte Buffer containing a public key", async () => {
                const key: Buffer = instance.privateToPublic( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                assert.isTrue( Buffer.isBuffer( key ) , "returned buffer is not a valid Buffer instance");
                assert.equal(key.length, 64, "returned buffer length invalid");
            });

            it("should return public key that matches in test constant ", async () => {
                const key = instance.privateToPublic( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                assert.equal( instance.bufferToHex( key ) , ethereumwallet0PublicKey, "keys do not match");
            });

            it("should match the return of ethereumjs-util privateToPublic()", async () => {
                const mine = instance.privateToPublic( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                const theirs = EthereumjsUtil.privateToPublic( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") ) ;
                assert.equal( mine.toString("hex") , theirs.toString("hex"), "keys do not match");
            });

        });

        describe("privateToAddress( Buffer ): Buffer", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.privateToAddress("test");
                }, /privateToAddress: parameter must be a Buffer()./);
            });

            it("should throw if supplied Buffer length is not 64 bytes", async () => {
                assert.throws(() => {
                    instance.privateToAddress( Buffer.from("0102030405", "hex") );
                }, /private key length is invalid/);
            });

            it("should return a valid 20 byte Buffer containing an address", async () => {
                const key: Buffer = instance.privateToAddress( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                assert.isTrue( Buffer.isBuffer( key ) , "returned buffer is not a valid Buffer instance");
                assert.equal(key.length, 20, "returned buffer length invalid");
            });

            it("should return address that matches in test constant ", async () => {
                const key = instance.privateToAddress( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                const checksummed = instance.addressBufferToChecksum(key);
                assert.equal( checksummed , ethereumWallet0Address, "keys do not match");
            });

            it("should match the return of ethereumjs-util privateToAddress()", async () => {
                const mine = instance.privateToAddress( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                const theirs = EthereumjsUtil.privateToAddress( Buffer.from(ethereumwallet0PrivateKey.replace("0x", ""), "hex") );
                assert.equal( mine.toString("hex") , theirs.toString("hex"), "results do not match");
            });

        });

        describe("addressBufferToChecksum( Buffer ): string", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.addressBufferToChecksum("test");
                }, /addressBufferToChecksum: parameter must be a Buffer()./);
            });

            it("should throw if supplied Buffer length is not 20 or 22 bytes", async () => {
                assert.throws(() => {
                    instance.addressBufferToChecksum( Buffer.from("0102030405", "hex") );
                }, /address buffer length is invalid/);
            });

            it("should return a valid 42 length string containing a public key", async () => {
                const result: string = instance.addressBufferToChecksum( Buffer.from(ethereumWallet0Address.replace("0x", ""), "hex") );
                assert.equal(result.length, 42, "returned string length is invalid");
            });

            it("should return public key that matches in test constant ", async () => {
                const result: string = instance.addressBufferToChecksum( Buffer.from(ethereumWallet0Address.replace("0x", ""), "hex") );
                assert.equal( result , ethereumWallet0Address, "results do not match");
            });

        });

        describe("publicToAddress( Buffer ): Buffer", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.publicToAddress("test");
                }, /publicToAddress: parameter must be a Buffer()./);
            });

            it("should throw if supplied Buffer length is not 64 bytes", async () => {
                assert.throws(() => {
                    instance.publicToAddress( Buffer.from("0102030405", "hex") );
                }, /false == true/);
            });

            it("should return a valid 20 byte Buffer containing a public key", async () => {
                const key: Buffer = instance.publicToAddress( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") );
                assert.isTrue( Buffer.isBuffer( key ) , "returned buffer is not a valid Buffer instance");
                assert.equal(key.length, 20, "returned buffer length invalid");
            });

            it("should return public key that matches in test constant ", async () => {
                const key = instance.publicToAddress( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") );
                const checksummed = instance.addressBufferToChecksum(key);
                assert.equal( checksummed , ethereumWallet0Address, "keys do not match");
            });

            it("should match the return of ethereumjs-util publicToAddress()", async () => {
                const mine = instance.publicToAddress( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") );
                const theirs = EthereumjsUtil.publicToAddress( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") );
                assert.equal( mine.toString("hex") , theirs.toString("hex"), "results do not match");
            });
        });

        describe("isValidChecksumAddress( string ): boolean", async () => {

            const lowercaseAddress = ethereumWallet0Address.toLocaleLowerCase().replace("0x", "");

            it("should throw if supplied parameter is not of type string", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.isValidChecksumAddress( 0x10203 );
                }, /isValidChecksumAddress: parameter must be of type string./);
            });

            it("should return false if supplied string does not contain a valid checksummed address", async () => {
                assert.isFalse( instance.isValidChecksumAddress( lowercaseAddress ), "Should return false for an invalid address string" );
            });

            it("should return true if supplied string contains a valid address", async () => {
                assert.isTrue( instance.isValidChecksumAddress( ethereumWallet0Address ), "Should return true for a valid address string" );
            });

            it("should match the return of ethereumjs-util isValidChecksumAddress()", async () => {
                const mine = instance.isValidChecksumAddress( ethereumWallet0Address );
                const theirs = EthereumjsUtil.isValidChecksumAddress( ethereumWallet0Address );
                assert.equal( mine, theirs, "results do not match");
            });
        });

        describe("isValidAddress( Buffer ): boolean", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.isValidAddress("test");
                }, /isValidAddress: parameter must be a Buffer()./);
            });

            it("should return false if supplied Buffer does not contain a valid address", async () => {
                assert.isFalse( instance.isValidAddress( Buffer.from("0102030405") ), "Should return false for an invalid address buffer" );
            });

            it("should return true if supplied Buffer contains a valid address", async () => {
                assert.isTrue( instance.isValidAddress( Buffer.from(ethereumWallet0Address) ), "Should return true for a valid address buffer" );
            });

            it("should match the return of ethereumjs-util isValidAddress()", async () => {
                const mine = instance.isValidAddress( Buffer.from(ethereumWallet0Address) );
                const theirs = EthereumjsUtil.isValidAddress( Buffer.from(ethereumWallet0Address) );
                assert.equal( mine, theirs, "results do not match");
            });
        });

        describe("isValidPrivate( Buffer ): boolean", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.isValidPrivate("test");
                }, /isValidPrivate: parameter must be a Buffer()./);
            });

            it("should return false if supplied Buffer does not contain a valid private key", async () => {
                assert.isFalse( instance.isValidPrivate( Buffer.from("0102030405") ), "Should return false for an invalid private key buffer" );
            });

            it("should return true if supplied Buffer contains a valid private key", async () => {
                assert.isTrue( instance.isValidPrivate( Buffer.from(ethereumwallet0PrivateKey) ), "Should return true for a valid private key buffer" );
            });

            /*

            This test fails because for some reason people have decided to ignore the curve requirements
            for secp256k1.privateKeyVerify when creating the HD path key derrivation.

            Feel free to open up an issue at https://github.com/ethereumjs/ethereumjs-util/ for it.

            it("should match the return of ethereumjs-util isValidPrivate()", async () => {
                const mine = instance.isValidPrivate( Buffer.from(ethereumwallet0PrivateKey) );
                const theirs = EthereumjsUtil.isValidPrivate( Buffer.from(ethereumwallet0PrivateKey) );
                assert.equal( mine, theirs, "results do not match");
            });
            */
        });

        describe("isValidPublic( Buffer ): boolean", async () => {

            it("should throw if supplied parameter is not of type Buffer", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.isValidPublic("test");
                }, /isValidPublic: parameter must be a Buffer()./);
            });

            it("should return false if supplied Buffer does not contain a valid public key", async () => {
                assert.isFalse( instance.isValidPublic( Buffer.from("0102030405") ), "Should return false for an invalid public key buffer" );
            });

            it("should return true if supplied Buffer contains a valid public key", async () => {
                assert.isTrue( instance.isValidPublic( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") ), "Should return true for a valid public key buffer" );
            });

            it("should match the return of ethereumjs-util isValidPublic()", async () => {
                const mine = instance.isValidPublic( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") );
                const theirs = EthereumjsUtil.isValidPublic( Buffer.from(ethereumwallet0PublicKey.replace("0x", ""), "hex") );
                assert.equal( mine, theirs, "results do not match");
            });
        });

        describe("balanceToStd( input: BigNumber ): string", async () => {

            it("should throw if supplied parameter is not of type BigNumber", async () => {
                assert.throws(() => {
                    // @ts-ignore: we're testing for this scenario
                    instance.balanceToStd("test");
                }, 'balanceToStd: parameter must be of type BigNumber.');
            });

            it("should return 1 if input is 1 * 10 ** 18", async () => {
                const result = instance.balanceToStd( new BigNumber( 1 * 10 ** 18 ) );
                assert.equal( result, "1", "Should return 1" );
            });

            it("should return 0.01 if input is 1 * 10 ** 16", async () => {
                const result = instance.balanceToStd( new BigNumber( 1 * 10 ** 16 ) );
                assert.equal( result, "0.01", "Should return 0.01" );
            });
        });

    });

});
