var DNode = require('dnode');

exports.double = function (assert) {
    var port = Math.floor(Math.random() * 40000 + 10000);
    
    var server = DNode({
        z : function (f, g, h) {
            f(10, function (x) {
                g(10, function (y) {
                    h(x,y)
                })
            })
        }
    }).listen(port);
    
    server.on('ready', function () {
        DNode.connect(port, function (remote) {
            remote.z(
                function (x,f) { f(x * 2) },
                function (x,f) { f(x / 2) },
                function (x,y) {
                    assert.equal(x, 20, 'double, not equal');
                    assert.equal(y, 5, 'double, not equal');
                    server.end();
                }
            );
            
            function plusTen(n,f) { f(n + 10) }
            
            remote.z(plusTen, plusTen, function (x,y) {
                assert.equal(x, 20, 'double, equal');
                assert.equal(y, 20, 'double, equal');
                server.end();
            });
        });
    });
};
