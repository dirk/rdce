// Leaking globals
var rdce_called, rdce_register, rdce;
// Closed functionality
(function () {
    if (typeof rdce === 'undefined') {
        rdce = {};
    }
    else {
        // Don't redefine rdce
        return;
    }
    var store = rdce.store = {};
    rdce_register = function (sig) {
        rdce.store[sig] = 0;
    };
    rdce_called = function (sig) {
        rdce.store[sig] = (rdce.store[sig] ? rdce.store[sig] : 0) + 1;
    };
    rdce.buildReportData = function () {
        var used = [], unused = [], keys = Object.keys(store);
        keys.forEach(function (k) {
            var v = store[k], item = { sig: k, count: v };
            if (v > 0) {
                used.push(item);
            }
            else {
                unused.push(item);
            }
        });
        return { used: used, unused: unused };
    };
    rdce.report = function () {
        var data = this.buildReportData(), sorter = function (a, b) {
            return a.sig.localeCompare(b.sig);
        }, used = data.used.sort(sorter), unused = data.unused.sort(sorter);
        // Build the report
        var printer = function (u) {
            report.push('  ' + u.sig + ' (' + u.count + ')');
        };
        var report = ['RDCE REPORT', 'Live functions:'];
        used.forEach(printer);
        report.push('');
        report.push('Dead functions:');
        unused.forEach(printer);
        console.log(report.join('\n'));
    };
})();
