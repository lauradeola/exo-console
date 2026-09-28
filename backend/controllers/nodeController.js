"use strict";

const nodeService =
    require("../services/nodeService");


function getNodes(req, res, next) {

    try {

        const nodes =
            nodeService.getNodes();

        res.json({
            count: nodes.length,
            nodes
        });

    } catch (error) {

        next(error);

    }

}


module.exports = {
    getNodes
};