/**
 * @preserve
 *
 *                                     .,,,;;,'''..
 *                                 .'','...     ..',,,.
 *                               .,,,,,,',,',;;:;,.  .,l,
 *                              .,',.     ...     ,;,   :l.
 *                             ':;.    .'.:do;;.    .c   ol;'.
 *      ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *     ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *    .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *     .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *    .:;,,::co0XOko'              ....''..'.'''''''.
 *    .dxk0KKdc:cdOXKl............. .. ..,c....
 *     .',lxOOxl:'':xkl,',......'....    ,'.
 *          .';:oo:...                        .
 *               .cd,    ╔═╗┌─┐┬─┐┬  ┬┌─┐┬─┐   .
 *                 .l;   ╚═╗├┤ ├┬┘└┐┌┘├┤ ├┬┘   '
 *                   'l. ╚═╝└─┘┴└─ └┘ └─┘┴└─  '.
 *                    .o.                   ...
 *                     .''''','.;:''.........
 *                          .'  .l
 *                         .:.   l'
 *                        .:.    .l.
 *                       .x:      :k;,.
 *                       cxlc;    cdc,,;;.
 *                      'l :..   .c  ,
 *                      o.
 *                     .,
 *
 *             ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *             ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *             ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * @fileOverview
 * @todo write description of what this block does
 *
 * Defines a new logic block that will appear in the crafting menu
 * Anytime data arrives at the block, the render function will be triggered.
 * The input data value(s) will arrive in thisBlock.data
 * After performing the block's behavior, write the output value(s) to thisBlock.processedData,
 * And finally call the callback function to send the data to whatever this block is next linked to
 *
 * gui/icon.svg is the small menu icon for the block
 * gui/label.svg is the full image on the block (for a block of blockSize=1 might be the same as icon.svg)
 * gui/index.html is the optional settings menu that pops up when you tap on the block
 */

var generalProperties = {
    // display name underneath icon in block menu
    name: 'seesaw',
    // set this to how wide the block should be - (the bigger of # inputs and # outputs)
    blockSize: 3,
    privateData: {},
    // these properties are accessible to user modification via the block's settings menu (gui/index.html)
    publicData: {toggle: true},
    // sets which input indices of the block can have links drawn to them
    activeInputs: [true, true, true, false],
    // sets which output indices of the block can have links drawn from them
    activeOutputs: [true, true, true, false],
    iconImage: 'icon.png',
    // not currently used anywhere, but helpful for developer reference
    nameInput: ['in', 'in', 'in', ''],
    nameOutput: ['digital out', 'digital out', 'out', ''],
    // should match the folder name
    type: 'seesaw'
};

exports.properties = generalProperties;

/**
 * This defines how the value should be transformed before sending it to the destination
 * @param {string} object - objectID (object/frame/node/block specifies the "street address" of this block)
 * @param {string} frame - frameID
 * @param {string} node - nodeID
 * @param {string} block - blockID
 * @param {number} index - the index of which input was just received. for example, a block with two inputs will have its render function called twice - once with index 0 and once with index 1. it is up to the implemented to decide whether to trigger the callback when either index is triggered, or only once all indices have received values, etc.
 * @param {{data: Array.<number>, processedData: Array:<number>, ...}} thisBlock - reference to the full block data struct
 * @param {function} callback - should be triggered with these arguments: (object, frame, node, block, index, thisBlock)
 */
exports.render = function (object, frame, node, block, index, thisBlock, callback)  {
    if (index === 0) {
        // if the first input receives a high value, and the toggle was flipped towards the second input, flip it back to the first and emit a 1 from the first output and a 0 from the second
        if (thisBlock.data[0].value > 0.5) {
            if (thisBlock.publicData.toggle !== false) {
                thisBlock.publicData.toggle = false;
                thisBlock.processedData[0].value = 1;
                thisBlock.processedData[1].value = 0;
                return callback(object, frame, node, block, index, thisBlock);
            }
        }
    } else if (index === 1) {
        // if the second input receives a high value, and the toggle was flipped towards the first input, flip it back to the second and emit a 1 from the second output and a 0 from the first
        if (thisBlock.data[1].value > 0.5) {
            if (thisBlock.publicData.toggle !== true) {
                thisBlock.publicData.toggle = true;
                thisBlock.processedData[0].value = 0;
                thisBlock.processedData[1].value = 1;
                return callback(object, frame, node, block, index, thisBlock);
            }
        }

    } else if (index === 2) {
        // if the third input receives data, and the toggle is flipped towards the second input, output the third input from the third output. if the toggle is flipped to the first input, do nothing
        if (thisBlock.publicData.toggle === true) {
            thisBlock.processedData[2] = thisBlock.data[2];
            return callback(object, frame, node, block, index, thisBlock);
        }
    }
};

/**
 * @todo: not working yet
 */
exports.setup = function (_object, _frame, _node, _block, _thisBlock, _callback) {
// add code here that should be executed once.
    // var publicData thisBlock.publicData;
    // callback(object, frame, node, block, index, thisBlock);
};
