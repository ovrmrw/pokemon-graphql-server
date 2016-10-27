const fs = require('fs-extra');
const path = require('path');

const root = path.resolve();

// fs.copy(root + '/lib/ts-node/dist/ts-node.js', root + '/node_modules/ts-node/dist/ts-node.js', err => {
//   if (err) { return console.error(err); }
//   console.log("ts-node.js overwrite success.");
// });
var err;
err = fs.copySync(root + '/lib/ts-node/dist/index.js', root + '/node_modules/ts-node/dist/index.js');
if (err) {
  console.error(err);
} else {
  console.log("ts-node/dist/index.js overwrite success. (for ts-node 0.9.3)");
}

err = fs.copySync(root + '/lib/ts-babel-node/index.js', root + '/node_modules/ts-babel-node/index.js');
if (err) {
  console.error(err);
} else {
  console.log("ts-babel-node/index.js overwrite success. (for ts-babel-node 1.0.0 working with ts-node 0.9.3)");
}

err = fs.copySync(root + '/lib/ts-babel-node/bin/ts-babel-node.js', root + '/node_modules/ts-babel-node/bin/ts-babel-node.js');
if (err) {
  console.error(err);
} else {
  console.log("ts-babel-node/bin/ts-babel-node.js overwrite success. (for ts-babel-node 1.0.0 working with ts-node 0.9.3)");
}

err = fs.copySync(root + '/lib/@types/dataloader/index.d.ts', root + '/node_modules/@types/dataloader/index.d.ts');
if (err) {
  console.error(err);
} else {
  console.log("@types/dataloader/index.d.ts overwrite success.");
}

console.log('\n');