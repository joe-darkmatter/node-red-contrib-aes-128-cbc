/* Zulkifli Hamzah <joe.darkmatter@gmail.com>. MIT license. See LICENSE.txt. */
module.exports = function(RED){
    var aes = require('aes-js');
    function CryptoAES128CBC(config){
        RED.nodes.createNode(this,config);
        this.topic = config.topic;

        this.on('input', function(msg){
            msg.topic = this.topic;

            var mode = (msg.mode!==undefined)? msg.mode.toLowerCase() : 'encrypt';
            var key = (msg.key!==undefined)?
                    (new Buffer.from(msg.key,'hex')) :
                    (new Buffer.from('000102030405060708090a0b0c0d0e0f','hex'));
            var iv = (msg.iv!==undefined)?
                    (new Buffer.from(msg.iv,'hex')) :
                    (new Buffer.from('00000000000000000000000000000000','hex'));

            var buf0 = new Buffer.from('00000000000000000000000000000000','hex');
            var arr = [key,buf0];
            var buf1 = new Buffer.concat(arr);
            key = buf1.slice(0,16);
            msg.key = key.toString('hex').toLowerCase();

            arr = [iv,buf0];
            buf1 = new Buffer.concat(arr);
            iv = buf1.slice(0,16);
            msg.iv = iv.toString('hex').toLowerCase();

            var pload = new Buffer.from(msg.payload,'hex');
            if (pload.length % 16 != 0){
                arr = [pload,buf0];
                buf1 = new Buffer.concat(arr);
                var len_adj = Math.floor(buf1.length/16) * 16; // Multiple of 16 bytes.
                pload = buf1.slice(0,len_adj);
            }
            msg.input_payload = pload.toString('hex').toLowerCase();

            if (mode == 'encrypt'){
                var aesCbc = new aes.ModeOfOperation.cbc(key, iv);
                msg.payload = '';
                for (let x=0; x<pload.length; x+=16){
                    var encryptedBytes = aesCbc.encrypt(pload.slice(x,x+16));
                    var encryptedHex = (new Buffer(encryptedBytes)).toString('hex');
                    msg.payload += encryptedHex;
                }
            }else if (mode == 'decrypt'){
                var aesCbc = new aes.ModeOfOperation.cbc(key, iv);
                msg.payload = '';
                for (let x=0; x<pload.length; x+=16){
                    var decryptedBytes = aesCbc.decrypt(pload.slice(x,x+16));
                    var decryptedText = (new Buffer(decryptedBytes)).toString('hex');
                    msg.payload += decryptedText;
                }
            }else{
                msg.payload = '';
            }
            this.send(msg);
        });
    }
    RED.nodes.registerType("aes-128-cbc",CryptoAES128CBC);
}
