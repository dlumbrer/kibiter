module.exports = function (kibana) {

  return new kibana.Plugin({

    uiExports: {
      visTypes: [
        'plugins/onion_vis/onion_vis'
      ]
    }

  });

};
