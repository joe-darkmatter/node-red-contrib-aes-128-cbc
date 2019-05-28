# NODE-RED-CONTRIB-AES-128-CBC

A node-red module implementing encrypt or decrypt function of hex string input with `128-bit AES block cipher algorithm` specifically on `CBC mode` of operation. The input and output are all in `string` format.

### Inputs

##### msg.payload
The string representing hexadecimal value to be encrypted or decrypted.
e.g. `'000102030405'` represents a byte array with the value of `0x00,0x01,0x02,0x03,0x04,0x05`.
Each encryption block is expected to be 16-byte block (i.e., 128 bits).
If the block size entered
is less than or greater than 16 bytes, it will be automatically padded with zeros so that
the payload will be a multiple of 16-byte block(s).
So for the example here, as many as 10 bytes with `0x00` values will be padded.

##### msg.key
The hexadecimal string representation for the encryption Key.
It must be set to 16 bytes (128 bits).
It will automatically be padded or trimmed to make it 16 bytes in length.

##### msg.iv
The hexadecimal string representation for the encryption Initialization Vector.
It must be set to 16 bytes (128 bits).
It will automatically be padded or trimmed to make it 16 bytes in length.

##### msg.mode
It has to be set to either `'encrypt'` or `'decrypt'`, which determines its function.

### Outputs

##### msg.payload
The hexadecimal string of encrypted or decrypted payload,
depending on the function defined at the input.

### Example

In a function module of node-red flow:

```javascript
msg.key = '000102030405060708090a0b0c0d0e0f';
msg.iv = '00020406080a0c0e';//Will be padded to be '00020406080a0c0e0000000000000000'
msg.mode = 'encrypt'; //Or 'decrypt'.
msg.payload = 'aabbccddeeff00112233445566778899';
return msg;
```

Connect the **function** module output to the **node-red-contrib-aes-128-cbc** module input.
**Inject** an event into the **function** module, and the output of the operation of the **node-red-contrib-aes-128-cbc** module can be viewed in `msg.payload` (with **Debug** module), which is in string type.

The output of the above settings on the `msg.payload` output will be as `'f903505157d1fcd600031711bd0b7ec0'`.

### Details
The algorithm used in this module utilizes the [AES-JS](https://github.com/ricmoo/aes-js)
block cipher library written by Richard Moore.

Question, suggestions, comments, etc.
E-mail me at `joe.darkmatter@gmail.com`
